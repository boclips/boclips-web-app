import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render as rtlRender } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { queryClientConfig } from 'src/hooks/api/queryClientConfig';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';

export const render = (component: React.ReactElement) =>
  rtlRender(
    <MemoryRouter initialEntries={['/']}>
      <QueryClientProvider client={new QueryClient(queryClientConfig)}>
        {component}
      </QueryClientProvider>
    </MemoryRouter>,
  );

export const renderWithClients = (component: React.ReactElement) =>
  rtlRender(
    <MemoryRouter>
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          {component}
        </QueryClientProvider>
      </BoclipsClientProvider>
    </MemoryRouter>,
  );
