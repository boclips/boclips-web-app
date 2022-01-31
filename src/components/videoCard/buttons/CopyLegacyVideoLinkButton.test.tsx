import React from 'react';
import { fireEvent } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { render } from 'src/testSupport/render';
import { CopyLegacyVideoLinkButton } from './CopyLegacyVideoLinkButton';

describe('CopyLegacyVideoLinkButton', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });

  it('copies the the video link when clicked', async () => {
    window.Environment = {
      LEGACY_VIDEOS_URL: 'https://myoldvideo.com/videos',
    };

    jest.spyOn(navigator.clipboard, 'writeText');

    const fakeClient = new FakeBoclipsClient();

    const video = VideoFactory.sample({ id: 'this-is-a-test' });

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={fakeClient}>
          <CopyLegacyVideoLinkButton video={video} />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    const button = await wrapper.findByLabelText('Copy legacy video link');

    fireEvent.click(button);

    expect(await wrapper.findByLabelText('Copied')).toBeVisible();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'https://myoldvideo.com/videos/this-is-a-test',
    );
  });
});
