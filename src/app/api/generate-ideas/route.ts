import { NextRequest, NextResponse } from "next/server";
import { generateObject, generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

// Zod schemas for validation
const GeneratedIdeaSchema = z.object({
  name: z.string().describe("A catchy, memorable product name"),
  description: z.string().describe("Clear description in 1-2 sentences"),
  coreFeatures: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe("3-5 specific and concise core features"),
  suggestedTechStack: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe("3-5 technologies for implementation"),
  leadGenerationIdeas: z
    .array(z.string())
    .min(3)
    .max(4)
    .describe("3-4 marketing/lead generation strategies"),
});

const IdeaGenerationSchema = z.object({
  ideas: z
    .array(GeneratedIdeaSchema)
    .length(3)
    .describe("Exactly 3 unique product ideas"),
});

// Request body schema
const RequestSchema = z.object({
  combination: z.object({
    market: z.string(),
    userType: z.string(),
    problemType: z.string(),
    techStack: z.string(),
  }),
  apiKey: z.string().min(1, "API key is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const { combination, apiKey } = RequestSchema.parse(body);

    // Create Anthropic client with user's API key
    const anthropic = createAnthropic({
      apiKey: apiKey,
    });

    // Step 1: Research the problem space using web search
    const webSearchTool = anthropic.tools.webSearch_20250305({ maxUses: 5 });

    const researchPrompt = `Research real problems for ${combination.userType} in ${combination.market} related to ${combination.problemType}. Find:
1. Top 3 pain points and unmet needs
2. Existing solutions and gaps
3. Recent trends and opportunities

Be concise. Focus on validated problems that need solving.`;

    // Try web search research, fallback to basic generation if rate limited
    let researchInsights = "";
    try {
      console.log("Starting web research for:", combination);
      const researchResult = await generateText({
        model: anthropic("claude-sonnet-4-20250514"),
        prompt: researchPrompt,
        tools: { web_search: webSearchTool },
      });
      console.log("Research completed, generating ideas...");

      // Truncate research if it's too long to avoid rate limits
      const maxResearchLength = 1500; // Reduced further
      researchInsights =
        researchResult.text.length > maxResearchLength
          ? researchResult.text.substring(0, maxResearchLength) + "..."
          : researchResult.text;
    } catch (error) {
      console.log("Web search failed, proceeding without research:", error);
      researchInsights =
        "No web research available due to rate limits. Generate ideas based on general market knowledge.";
    }

    // Build the prompt with research insights
    const prompt = `Generate 3 product ideas for ${combination.userType} in ${combination.market} using ${combination.techStack}:

RESEARCH:
${researchInsights}

Based on research, create 3 ideas addressing real problems. Each needs:
- Name
- Description (1-2 sentences referencing research problems)
- 3-5 core features solving researched problems
- 3-5 technologies (include ${combination.techStack})
- 3-4 marketing strategies

Make ideas unique, feasible for solo developers, addressing research-validated problems.

Respond only with valid JSON, no additional text.`;

    // Generate ideas using Anthropic
    const result = await generateObject({
      model: anthropic("claude-sonnet-4-20250514"),
      schema: IdeaGenerationSchema,
      prompt,
      temperature: 0.8,
    });

    return NextResponse.json({
      ideas: result.object.ideas,
      combination,
    });
  } catch (error) {
    console.error("API Route Error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    // Handle AI/API errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (
        errorMessage.includes("401") ||
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("api key")
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid API key. Please check your Anthropic API key in settings.",
          },
          { status: 401 }
        );
      }

      if (errorMessage.includes("429") || errorMessage.includes("rate limit")) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again in a moment." },
          { status: 429 }
        );
      }

      if (
        errorMessage.includes("400") ||
        errorMessage.includes("bad request")
      ) {
        return NextResponse.json(
          { error: "Invalid request. Please try again." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: `AI Error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
