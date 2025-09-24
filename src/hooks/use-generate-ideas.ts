import { useMutation } from '@tanstack/react-query';
import { Combination, IdeaGenerationResponse, IdeaGenerationError } from '@/lib/types';
import { createAIService } from '@/lib/ai-service';
import { getStoredApiKey } from '@/lib/utils';

interface GenerateIdeasParams {
  combination: Combination;
  apiKey?: string;
}

const generateIdeas = async ({ combination, apiKey }: GenerateIdeasParams): Promise<IdeaGenerationResponse> => {
  const key = apiKey || getStoredApiKey();

  if (!key) {
    throw new Error('API key is required');
  }

  const aiService = createAIService(key);
  return aiService.generateIdeas(combination);
};

export const useGenerateIdeas = () => {
  return useMutation<IdeaGenerationResponse, IdeaGenerationError, GenerateIdeasParams>({
    mutationFn: generateIdeas,
    retry: (failureCount, error) => {
      // Don't retry API key errors
      if (error?.code === 'INVALID_API_KEY') {
        return false;
      }
      // Retry rate limits up to 3 times with exponential backoff
      if (error?.code === 'RATE_LIMIT') {
        return failureCount < 3;
      }
      // Retry other errors once
      return failureCount < 1;
    },
    retryDelay: (attemptIndex, error) => {
      // Exponential backoff for rate limits
      if (error?.code === 'RATE_LIMIT') {
        return Math.min(1000 * Math.pow(2, attemptIndex), 30000);
      }
      return 1000;
    },
  });
};