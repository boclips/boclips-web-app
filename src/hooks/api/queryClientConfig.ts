import { DefaultOptions } from '@tanstack/react-query';

export const queryClientConfig: { defaultOptions: DefaultOptions } = {
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
};
