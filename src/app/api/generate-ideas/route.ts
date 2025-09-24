import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
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

    // Build the prompt
    const prompt = `You are a product ideation expert helping indie hackers and solo entrepreneurs. Generate exactly 3 unique, actionable product ideas based on this combination:

Market: ${combination.market}
User Type: ${combination.userType}
Problem Type: ${combination.problemType}
Tech Stack: ${combination.techStack}

For each idea, provide:
- A catchy, memorable product name
- Clear description in 1-2 sentences
- 3-5 specific and concise core features
- 3-5 technologies for implementation (can include but not limited to the suggested tech stack)
- 3-4 marketing/lead generation strategies

Make each idea unique, feasible for a solo developer or small team, and directly address the specified problem type for the target user type in the given market.

Focus on practical, implementable solutions that could realistically be built and monetized. Consider current market trends and user needs.

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
