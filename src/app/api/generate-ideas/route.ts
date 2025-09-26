import { NextRequest, NextResponse } from "next/server";
import { generateText, generateObject } from "ai";
import { createPerplexity } from "@ai-sdk/perplexity";
import { createOpenAI } from "@ai-sdk/openai";
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
  model: z.enum(["sonar-reasoning", "sonar-reasoning-pro"]).default("sonar-reasoning-pro"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const { combination, apiKey, model } = RequestSchema.parse(body);

    // Create Perplexity client with user's API key via Vercel AI Gateway
    const perplexity = createPerplexity({
      apiKey: apiKey,
      baseURL: 'https://ai-gateway.vercel.sh/v1',
    });

    // Create OpenAI client for JSON parsing
    const openai = createOpenAI({
      apiKey: apiKey,
      baseURL: 'https://ai-gateway.vercel.sh/v1',
    });

    const optimizedPrompt = `You are a product idea generator with real-time web search capabilities. Generate 3 unique, feasible product ideas for ${combination.userType} in ${combination.market} using ${combination.techStack}.

PROJECT SCOPE: ${combination.projectScope}
This is crucial - all ideas must be appropriately scoped for a ${combination.projectScope.toLowerCase()}:
- Weekend Project: Simple MVP, 1-2 core features, minimal setup
- 1 Week Sprint: Basic app with 2-3 key features, simple architecture
- 1 Month Build: Feature-rich application with good UX/UI, proper architecture
- 3 Month Project: Complex application with advanced features, integrations, scalability considerations
- 6 Month Journey: Enterprise-grade solution with comprehensive features, testing, documentation, deployment

TASK: Research current trends and challenges for ${combination.userType} in ${combination.market} who need ${combination.problemType} solutions in 2025, then generate ideas that address these specific problems.

Requirements for each idea:
- Name: Catchy, memorable product name
- Description: 1-2 sentences addressing ${combination.problemType} problems for ${combination.userType} in ${combination.market} AND appropriate for the ${combination.projectScope.toLowerCase()} timeline
- Core Features: 3-5 specific features scoped appropriately for ${combination.projectScope.toLowerCase()}
- Tech Stack: 3-5 technologies (must include ${combination.techStack}) suitable for the project scope
- Marketing: 3-4 lead generation strategies realistic for an indie developer in this timeframe

Make ideas unique, feasible for solo developers, properly scoped for ${combination.projectScope.toLowerCase()}, based on real 2025 market research about ${combination.problemType} challenges for ${combination.userType} in ${combination.market}.

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

    // Step 1: Get reasoning response from Perplexity
    const perplexityResult = await withRetry(async () => {
      return await generateText({
        model: perplexity(`perplexity/${model}`),
        messages: [
          {
            role: "user",
            content: optimizedPrompt,
          },
        ],
        temperature: 0.8,
      });
    });

    console.log("Perplexity reasoning response received:", perplexityResult.text.substring(0, 200) + "...");

    // Step 2: Parse structured JSON from the reasoning response using GPT-4o
    const parsedResult = await withRetry(async () => {
      return await generateObject({
        model: openai("openai/gpt-4o"),
        messages: [
          {
            role: "user",
            content: `Extract and format the 3 product ideas from the following reasoning response into the exact JSON structure requested. If the reasoning response contains ideas that don't perfectly match the structure, adapt them appropriately while preserving the core concepts and insights.

REASONING RESPONSE:
${perplexityResult.text}

Extract exactly 3 ideas and format them as valid JSON with this structure:
- name: catchy product name
- description: clear 1-2 sentence description
- coreFeatures: array of 3-5 specific features
- suggestedTechStack: array of 3-5 technologies (must include ${combination.techStack})
- leadGenerationIdeas: array of 3-4 marketing strategies

Return only the structured JSON, no explanations or markdown.`,
          },
        ],
        schema: IdeaGenerationSchema,
        temperature: 0.1,
      });
    });

    return NextResponse.json({
      ideas: parsedResult.object.ideas,
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
              "Invalid API key. Please check your Vercel AI Gateway API key in settings.",
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
