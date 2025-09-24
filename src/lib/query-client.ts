import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error: unknown) => {
        // Don't retry on 400-level errors except rate limits
        const errorStatus = (error as { status?: number })?.status;
        if (errorStatus && errorStatus >= 400 && errorStatus < 500 && errorStatus !== 429) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: (failureCount, error: unknown) => {
        // Retry rate limits with exponential backoff
        if ((error as { status?: number })?.status === 429) {
          return failureCount < 3;
        }
        return false;
      },
    },
  },
});