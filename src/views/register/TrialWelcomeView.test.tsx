import { render, waitFor } from '@testing-library/react';
import { Helmet } from 'react-helmet';
import React from 'react';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TrialWelcomeView from 'src/views/register/TrialWelcomeView';

describe('TrialWelcome', () => {
  it('displays trial welcome view', async () => {
    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <TrialWelcomeView />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    const helmet = Helmet.peek();

    await waitFor(() => {
      expect(helmet.title).toEqual('Welcome');
    });

    expect(
      wrapper.getByText("You've just been added to Boclips by your colleague"),
    ).toBeVisible();
  });
});
