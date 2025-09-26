import { useMutation } from '@tanstack/react-query';
import { Combination, IdeaGenerationResponse, IdeaGenerationError } from '@/lib/types';
import { PerplexityModel } from '@/lib/utils';

interface GenerateIdeasParams {
  combination: Combination;
  apiKey: string;
  model: PerplexityModel;
}

const generateIdeas = async ({ combination, apiKey, model }: GenerateIdeasParams): Promise<IdeaGenerationResponse> => {
  const response = await fetch('/api/generate-ideas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ combination, apiKey, model }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: IdeaGenerationError = {
      code: response.status === 401 ? 'INVALID_API_KEY'
           : response.status === 429 ? 'RATE_LIMIT'
           : 'API_ERROR',
      message: errorData.error || `HTTP ${response.status}`,
    };
    throw error;
  }

  return response.json();
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