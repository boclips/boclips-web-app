import { render, screen, waitFor } from '@testing-library/react';
import { Helmet } from 'react-helmet';
import React from 'react';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { MemoryRouter } from 'react-router-dom';
import ClassroomRegisterView from 'src/views/classroom/register/ClassroomRegisterView';

describe('ClassroomRegisterView', () => {
  it('displays Register as window title for /classroom/register', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <MemoryRouter>
              <ClassroomRegisterView />
            </MemoryRouter>
          </BoclipsSecurityProvider>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    const helmet = Helmet.peek();

    await waitFor(() => {
      expect(helmet.title).toEqual('Register');
    });

    expect(screen.getByTestId('classroom-logo')).toBeInTheDocument();
  });
});
