import React from 'react';
import { within } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { render } from '@src/testSupport/render';
import { ToastContainer } from 'react-toastify';
import { CopyVideoIdButton } from './CopyVideoIdButton';
import userEvent from '@testing-library/user-event';

describe('CopyVideoIdButton', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });

  it('copies the the video id when clicked', async () => {
    vi.spyOn(navigator.clipboard, 'writeText');

    const fakeClient = new FakeBoclipsClient();

    const video = VideoFactory.sample({ id: 'video-id-123' });

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={fakeClient}>
          <ToastContainer />
          <CopyVideoIdButton video={video} />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    const button = await wrapper.findByLabelText('Copy video id');

    await userEvent.click(button);

    const notification = await wrapper.findByRole('alert');
    expect(within(notification).getByText('Copied!')).toBeVisible();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('video-id-123');
  });
});
