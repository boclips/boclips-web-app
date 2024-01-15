import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import WelcomeModal from 'src/components/welcome/WelcomeModal';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';

describe('Welcome Modal', () => {
  it('selected discovery methods are propagated to client', async () => {
    const queryClient = new QueryClient();
    const fakeBoclipsClient = new FakeBoclipsClient();

    const wrapper = render(
      <QueryClientProvider client={queryClient}>
        <BoclipsClientProvider client={fakeBoclipsClient}>
          <WelcomeModal showPopup={jest.fn()} />
          );
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    // todo: insert user
    // todo: insert account
    // todo: force admin user view

    expect(await wrapper.findByText('I heard about Boclips')).toBeVisible();
    const discoveryMethodDropdown = await wrapper.findByText('Via: Online');

    fireEvent.click(discoveryMethodDropdown);
    fireEvent.click(await wrapper.findByText('Contacted by Boclips'));
    fireEvent.click(await wrapper.findByText('Social Media'));

    fireEvent.click(await wrapper.findByRole('button', { name: "Let's Go!" }));
  });
});
