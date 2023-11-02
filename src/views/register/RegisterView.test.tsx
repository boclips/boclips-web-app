import { render, waitFor } from '@testing-library/react';
import { Helmet } from 'react-helmet';
import React from 'react';
import RegisterView from 'src/views/register/RegisterView';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('RegisterView', () => {
  it('displays Register as window title for /register', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <RegisterView />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    const helmet = Helmet.peek();

    await waitFor(() => {
      expect(helmet.title).toEqual('Register');
    });
  });
});
