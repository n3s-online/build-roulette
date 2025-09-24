import Anthropic from "@anthropic-ai/sdk";
import {
  Combination,
  GeneratedIdea,
  IdeaGenerationResponse,
  IdeaGenerationError,
} from "./types";

export class AIService {
  private anthropic: Anthropic;

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for client-side usage
    });
  }

  async generateIdeas(
    combination: Combination
  ): Promise<IdeaGenerationResponse> {
    try {
      const prompt = this.buildPrompt(combination);

      const response = await this.anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        temperature: 0.8,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (!content || content.type !== "text") {
        throw new Error("Unexpected response format from AI");
      }

      const ideas = this.parseResponse(content.text);

      return {
        ideas,
        combination,
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      throw this.handleError(error);
    }
  }

  private buildPrompt(combination: Combination): string {
    return `You are a product ideation expert helping indie hackers and solo entrepreneurs. Generate exactly 3 unique, actionable product ideas based on this combination:

Market: ${combination.market}
User Type: ${combination.userType}
Problem Type: ${combination.problemType}
Tech Stack: ${combination.techStack}

For each idea, provide:
1. A catchy, memorable name
2. A clear 1-2 sentence description
3. 3-5 core features (be specific and concise)
4. 3-5 suggested technologies for implementation
5. 3-4 lead generation/marketing strategies

Format your response as valid JSON with this exact structure:
{
  "ideas": [
    {
      "name": "Product Name",
      "description": "Clear description in 1-2 sentences.",
      "coreFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
      "suggestedTechStack": ["Tech 1", "Tech 2", "Tech 3", "Tech 4", "Tech 5"],
      "leadGenerationIdeas": ["Strategy 1", "Strategy 2", "Strategy 3", "Strategy 4"]
    }
  ]
}

Make sure each idea is:
- Feasible for a solo developer/small team
- Addresses the specific problem type for the user type
- Fits the market and tech stack constraints
- Has clear monetization potential
- Is differentiated from the other ideas

Respond only with valid JSON, no additional text.`;
  }

  private parseResponse(responseText: string): GeneratedIdea[] {
    try {
      // Clean the response text to ensure it's valid JSON
      let cleanedText = responseText.trim();

      // Remove markdown code blocks if present
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      const parsed = JSON.parse(cleanedText);

      if (!parsed.ideas || !Array.isArray(parsed.ideas)) {
        throw new Error("Invalid response structure: missing ideas array");
      }

      // Validate each idea has required fields
      const validatedIdeas: GeneratedIdea[] = parsed.ideas.map(
        (idea: any, index: number) => {
          if (
            !idea.name ||
            !idea.description ||
            !Array.isArray(idea.coreFeatures) ||
            !Array.isArray(idea.suggestedTechStack) ||
            !Array.isArray(idea.leadGenerationIdeas)
          ) {
            throw new Error(`Invalid idea structure at index ${index}`);
          }

          return {
            name: String(idea.name),
            description: String(idea.description),
            coreFeatures: idea.coreFeatures.map((f: any) => String(f)),
            suggestedTechStack: idea.suggestedTechStack.map((t: any) =>
              String(t)
            ),
            leadGenerationIdeas: idea.leadGenerationIdeas.map((l: any) =>
              String(l)
            ),
          };
        }
      );

      if (validatedIdeas.length !== 3) {
        throw new Error(
          `Expected exactly 3 ideas, got ${validatedIdeas.length}`
        );
      }

      return validatedIdeas;
    } catch (error) {
      console.error("Failed to parse AI response:", responseText);
      throw new Error(
        `Failed to parse AI response: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private handleError(error: unknown): IdeaGenerationError {
    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        return {
          message:
            "Invalid API key. Please check your Anthropic API key in settings.",
          code: "INVALID_API_KEY",
        };
      } else if (error.status === 429) {
        return {
          message: "Rate limit exceeded. Please try again in a moment.",
          code: "RATE_LIMIT",
        };
      } else if (error.status === 400) {
        return {
          message: "Invalid request. Please try again.",
          code: "BAD_REQUEST",
        };
      }

      return {
        message: `API Error: ${error.message}`,
        code: "API_ERROR",
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        code: "PROCESSING_ERROR",
      };
    }

    return {
      message: "An unexpected error occurred. Please try again.",
      code: "UNKNOWN_ERROR",
    };
  }
}

// Factory function to create AI service with stored API key
export function createAIService(apiKey: string): AIService {
  return new AIService(apiKey);
}
