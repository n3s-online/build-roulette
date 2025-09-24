import {
  Combination,
  IdeaGenerationResponse,
  IdeaGenerationError,
} from "./types";

export class AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateIdeas(
    combination: Combination
  ): Promise<IdeaGenerationResponse> {
    try {
      const response = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          combination,
          apiKey: this.apiKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("AI Service Error:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        apiKey: this.apiKey ? "Present" : "Missing",
      });
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): IdeaGenerationError {
    // Handle Vercel AI SDK errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (
        errorMessage.includes("401") ||
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("api key")
      ) {
        return {
          message:
            "Invalid API key. Please check your Anthropic API key in settings.",
          code: "INVALID_API_KEY",
        };
      }

      if (errorMessage.includes("429") || errorMessage.includes("rate limit")) {
        return {
          message: "Rate limit exceeded. Please try again in a moment.",
          code: "RATE_LIMIT",
        };
      }

      if (
        errorMessage.includes("400") ||
        errorMessage.includes("bad request")
      ) {
        return {
          message: "Invalid request. Please try again.",
          code: "BAD_REQUEST",
        };
      }

      return {
        message: `AI Error: ${error.message}`,
        code: "AI_ERROR",
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
