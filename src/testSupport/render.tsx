import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render as rtlRender } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClientConfig } from 'src/hooks/api/queryClientConfig';

export const render = (component: React.ReactElement) =>
  rtlRender(
    <MemoryRouter initialEntries={['/']}>
      <QueryClientProvider client={new QueryClient(queryClientConfig)}>
        {component}
      </QueryClientProvider>
    </MemoryRouter>,
  );
