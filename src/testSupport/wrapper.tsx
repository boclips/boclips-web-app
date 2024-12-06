import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';

export const wrapperWithClients = (
  boclipsClient: FakeBoclipsClient,
  queryClient: QueryClient,
) => {
  const wrapper = ({ children }) => (
    <BoclipsClientProvider client={boclipsClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </BoclipsClientProvider>
  );
  return wrapper;
};
