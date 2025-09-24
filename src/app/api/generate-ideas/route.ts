import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

// Rate limiting and retry utilities
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const isRateLimit = (error as Error)?.message?.includes('429') ||
                         (error as Error)?.message?.includes('rate limit') ||
                         (error as { status?: number })?.status === 429;

      if (!isRateLimit || attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      console.log(`Rate limited, retrying in ${Math.round(delay)}ms (attempt ${attempt}/${maxRetries})`);
      await sleep(delay);
    }
  }
  throw new Error('Max retries exceeded');
}

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
    projectScope: z.string(),
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

    // Optimized single API call with built-in web search capability
    const webSearchTool = anthropic.tools.webSearch_20250305({ maxUses: 3 }); // Reduced from 5 to 3

    const optimizedPrompt = `You are a product idea generator with web search capabilities. Generate 3 unique, feasible product ideas for ${combination.userType} in ${combination.market} using ${combination.techStack}.

PROJECT SCOPE: ${combination.projectScope}
This is crucial - all ideas must be appropriately scoped for a ${combination.projectScope.toLowerCase()}:
- Weekend Project: Simple MVP, 1-2 core features, minimal setup
- 1 Week Sprint: Basic app with 2-3 key features, simple architecture
- 1 Month Build: Feature-rich application with good UX/UI, proper architecture
- 3 Month Project: Complex application with advanced features, integrations, scalability considerations
- 6 Month Journey: Enterprise-grade solution with comprehensive features, testing, documentation, deployment

TASK: Use web search to quickly identify 2-3 current pain points for ${combination.userType} in ${combination.market}, then generate ideas that address these problems.

Requirements for each idea:
- Name: Catchy, memorable product name
- Description: 1-2 sentences addressing researched problems AND appropriate for the ${combination.projectScope.toLowerCase()} timeline
- Core Features: 3-5 specific features scoped appropriately for ${combination.projectScope.toLowerCase()}
- Tech Stack: 3-5 technologies (must include ${combination.techStack}) suitable for the project scope
- Marketing: 3-4 lead generation strategies realistic for an indie developer in this timeframe

Make ideas unique, feasible for solo developers, properly scoped for ${combination.projectScope.toLowerCase()}, based on real market research.

Return ONLY valid JSON matching this exact structure:
{
  "ideas": [
    {
      "name": "string",
      "description": "string",
      "coreFeatures": ["string", "string", "string"],
      "suggestedTechStack": ["string", "string", "string"],
      "leadGenerationIdeas": ["string", "string", "string"]
    }
  ]
}`;

    // Single API call with retry logic and web search
    const result = await withRetry(async () => {
      return await generateText({
        model: anthropic("claude-sonnet-4-20250514"),
        prompt: optimizedPrompt,
        tools: { web_search: webSearchTool },
        temperature: 0.8,
      });
    });

    // Parse the JSON response with better error handling
    let parsedResult;
    try {
      // Clean the response text - remove any markdown formatting
      let cleanText = result.text.trim();

      // If response is wrapped in markdown code blocks, extract the JSON
      const jsonMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        cleanText = jsonMatch[1].trim();
      }

      // Remove any leading/trailing non-JSON content
      const jsonStart = cleanText.indexOf('{');
      const jsonEnd = cleanText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
      }

      console.log("Attempting to parse AI response:", cleanText.substring(0, 200) + "...");
      parsedResult = JSON.parse(cleanText);

      // Validate with Zod
      const validatedResult = IdeaGenerationSchema.parse(parsedResult);
      parsedResult = validatedResult;

    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw AI response:", result.text.substring(0, 500) + "...");

      // Fallback: generate basic ideas without web search
      console.log("Falling back to basic idea generation...");
      const fallbackResult = await withRetry(async () => {
        return await generateText({
          model: anthropic("claude-sonnet-4-20250514"),
          prompt: `Generate exactly 3 product ideas for ${combination.userType} in ${combination.market} using ${combination.techStack}.

Return ONLY valid JSON in this exact format (no extra text, no markdown, no explanations):
{
  "ideas": [
    {
      "name": "Product Name 1",
      "description": "Brief description addressing a real problem",
      "coreFeatures": ["Feature 1", "Feature 2", "Feature 3"],
      "suggestedTechStack": ["${combination.techStack}", "Tech 2", "Tech 3"],
      "leadGenerationIdeas": ["Marketing 1", "Marketing 2", "Marketing 3"]
    },
    {
      "name": "Product Name 2",
      "description": "Brief description addressing a real problem",
      "coreFeatures": ["Feature 1", "Feature 2", "Feature 3"],
      "suggestedTechStack": ["${combination.techStack}", "Tech 2", "Tech 3"],
      "leadGenerationIdeas": ["Marketing 1", "Marketing 2", "Marketing 3"]
    },
    {
      "name": "Product Name 3",
      "description": "Brief description addressing a real problem",
      "coreFeatures": ["Feature 1", "Feature 2", "Feature 3"],
      "suggestedTechStack": ["${combination.techStack}", "Tech 2", "Tech 3"],
      "leadGenerationIdeas": ["Marketing 1", "Marketing 2", "Marketing 3"]
    }
  ]
}`,
          temperature: 0.3,
        });
      });

      try {
        let fallbackText = fallbackResult.text.trim();
        const fallbackMatch = fallbackText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (fallbackMatch && fallbackMatch[1]) {
          fallbackText = fallbackMatch[1].trim();
        }

        const fallbackStart = fallbackText.indexOf('{');
        const fallbackEnd = fallbackText.lastIndexOf('}');
        if (fallbackStart !== -1 && fallbackEnd !== -1) {
          fallbackText = fallbackText.substring(fallbackStart, fallbackEnd + 1);
        }

        parsedResult = JSON.parse(fallbackText);
        const validatedFallback = IdeaGenerationSchema.parse(parsedResult);
        parsedResult = validatedFallback;
        console.log("Fallback generation successful");

      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        throw new Error("AI service temporarily unavailable. Please try again.");
      }
    }

    return NextResponse.json({
      ideas: parsedResult.ideas,
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
