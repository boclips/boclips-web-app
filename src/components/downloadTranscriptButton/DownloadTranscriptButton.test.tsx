import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { render, waitFor } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import React from 'react';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { ToastContainer } from 'react-toastify';
import { DownloadTranscriptButton } from '@components/downloadTranscriptButton/DownloadTranscriptButton';
import { Link } from 'boclips-api-client/dist/sub-clients/common/model/LinkEntity';
import { sleep } from '@src/testSupport/sleep';
import userEvent from '@testing-library/user-event';

describe(`download transcript button`, () => {
  it(`downloads the transcript on click`, async () => {
    const video = VideoFactory.sample({
      links: {
        self: new Link({ href: 'fake-link' }),
        logInteraction: new Link({ href: 'fake-link' }),
        transcript: new Link({ href: 'fake-link' }),
      },
    });
    global.URL.revokeObjectURL = vi.fn();
    global.URL.createObjectURL = vi.fn();
    const fakeClient = new FakeBoclipsClient();
    const getTranscriptSpy = vi
      .spyOn(fakeClient.videos, 'getTranscript')
      .mockImplementation(() =>
        Promise.resolve({ content: 'blah', filename: 'blah.txt' }),
      );

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <ToastContainer />
        <DownloadTranscriptButton video={video} />
      </BoclipsClientProvider>,
    );

    await userEvent.click(
      wrapper.getByRole('button', { name: 'download-transcript' }),
    );

    expect(getTranscriptSpy).toHaveBeenCalledWith(video);

    // give time for toast to display
    await sleep(5);
    expect(await wrapper.queryByText('Download failed!')).toBeNull();
  });

  it(`displays a toast when download fails`, async () => {
    const video = VideoFactory.sample({
      links: {
        self: new Link({ href: 'fake-link' }),
        logInteraction: new Link({ href: 'fake-link' }),
        transcript: new Link({ href: 'fake-link' }),
      },
    });
    const fakeClient = new FakeBoclipsClient();

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <ToastContainer />
        <DownloadTranscriptButton video={video} />
      </BoclipsClientProvider>,
    );

    await userEvent.click(
      wrapper.getByRole('button', { name: 'download-transcript' }),
    );

    expect(await wrapper.findByText('Download failed!')).toBeVisible();
  });

  it(`shows tooltip when hovering on button`, async () => {
    const video = VideoFactory.sample({});
    const fakeClient = new FakeBoclipsClient();
    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <ToastContainer />
        <DownloadTranscriptButton video={video} />
      </BoclipsClientProvider>,
    );

    await userEvent.hover(
      wrapper.getByRole('button', { name: 'download-transcript' }),
    );

    await waitFor(() => {
      expect(wrapper.getByRole('tooltip')).toBeInTheDocument();
      expect(wrapper.getAllByText('Download transcript')).toHaveLength(2);
    });
  });
});
