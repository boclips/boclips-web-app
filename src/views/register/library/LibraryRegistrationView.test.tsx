import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import React from 'react';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { MemoryRouter } from 'react-router-dom';
import LibraryRegistrationView from 'src/views/register/library/LibraryRegistrationView';

describe('RegisterView', () => {
  it('displays Register as window title for /register', async () => {
    render(
      <HelmetProvider>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
              <MemoryRouter>
                <LibraryRegistrationView />
              </MemoryRouter>
            </BoclipsSecurityProvider>
          </BoclipsClientProvider>
        </QueryClientProvider>
      </HelmetProvider>,
    );

    await waitFor(() => {
      expect(document.title).toEqual('Register');
    });
  });
});
