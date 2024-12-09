import React from 'react';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import {
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { VideoInteractedWith } from 'boclips-api-client/dist/sub-clients/events/model/EventRequest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { buildVideoDetailsLink } from '@src/services/buildVideoDetailsLink';
import { ToastContainer } from 'react-toastify';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { CopyVideoLinkButton } from './CopyVideoLinkButton';

describe('CopyLinkButton', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });

  it('tracks event when button is pressed', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.insertCurrentUser(UserFactory.sample());

    const video = VideoFactory.sample({});
    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={fakeClient}>
          <ToastContainer />
          <CopyVideoLinkButton video={video} />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    await waitFor(() => wrapper.getByTestId('copy-button-true'));

    const button = wrapper.getByLabelText('Copy video link');

    fireEvent.click(button);

    await wrapper.findByText('Copied!');

    expect(fakeClient.events.getEvents().length).toEqual(1);
    const videoInteractedEvent =
      fakeClient.events.getEvents()[0] as VideoInteractedWith;
    expect(videoInteractedEvent.type).toEqual('VIDEO_INTERACTED_WITH');
    expect(videoInteractedEvent.subtype).toEqual('VIDEO_LINK_COPIED');
  });

  it('copies the the video link when clicked', async () => {
    vi.spyOn(navigator.clipboard, 'writeText');

    const fakeClient = new FakeBoclipsClient();

    const user = await fakeClient.users.getCurrentUser();
    const video = VideoFactory.sample({ id: 'this-is-a-test' });

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={fakeClient}>
          <ToastContainer />
          <CopyVideoLinkButton video={video} />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    await waitFor(() => wrapper.getByTestId('copy-button-true'));

    const button = await wrapper.findByLabelText('Copy video link');

    act(() => {
      fireEvent.click(button);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      buildVideoDetailsLink(video, user),
    );

    const notification = await wrapper.findByRole('alert');
    expect(within(notification).getByText('Copied!')).toBeVisible();
  });
});
