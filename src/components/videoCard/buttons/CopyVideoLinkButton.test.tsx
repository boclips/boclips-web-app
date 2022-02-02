import React from 'react';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { VideoInteractedWith } from 'boclips-api-client/dist/sub-clients/events/model/EventRequest';
import { QueryClient, QueryClientProvider } from 'react-query';
import { buildVideoDetailsLink } from 'src/services/buildVideoDetailsLink';
import { CopyVideoLinkButton } from './CopyVideoLinkButton';

describe('CopyLinkButton', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });

  it('tracks event when button is pressed', async () => {
    const fakeClient = new FakeBoclipsClient();
    const video = VideoFactory.sample({});
    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={fakeClient}>
          <CopyVideoLinkButton video={video} />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );
    const button = await wrapper.findByLabelText('Copy video link');
    fireEvent.click(button);

    await waitFor(() => {
      expect(fakeClient.events.getEvents().length).toEqual(1);

      const videoInteractedEvent =
        fakeClient.events.getEvents()[0] as VideoInteractedWith;
      expect(videoInteractedEvent.type).toEqual('VIDEO_INTERACTED_WITH');
      expect(videoInteractedEvent.subtype).toEqual('VIDEO_LINK_COPIED');
    });
  });

  it('copies the the video link when clicked', async () => {
    jest.spyOn(navigator.clipboard, 'writeText');

    const fakeClient = new FakeBoclipsClient();

    const user = await fakeClient.users.getCurrentUser();
    const video = VideoFactory.sample({ id: 'this-is-a-test' });

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={fakeClient}>
          <CopyVideoLinkButton video={video} />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    const button = await wrapper.findByLabelText('Copy video link');

    act(() => {
      fireEvent.click(button);
    });

    expect(await wrapper.findByLabelText('Copied')).toBeVisible();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      buildVideoDetailsLink(video, user),
    );
  });
});
