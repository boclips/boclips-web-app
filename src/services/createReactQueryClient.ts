import { MutationCache, QueryCache, QueryClient } from 'react-query';

export const createReactQueryClient = () => {
  const mutationCache = new MutationCache();
  const queryCache = new QueryCache();
  return new QueryClient({
    queryCache,
    mutationCache,
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};
