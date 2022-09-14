import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import {
  fireEvent,
  render,
  waitFor,
  within,
  screen,
} from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { EmbedButton } from 'src/components/embedButton/EmbedButton';
import React from 'react';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { ToastContainer } from 'react-toastify';

describe(`embed button`, () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });

  it(`copies the embed code to clipboard on click`, async () => {
    jest.spyOn(navigator.clipboard, 'writeText');

    const video = VideoFactory.sample({});
    const fakeClient = new FakeBoclipsClient();
    const createCodeSpy = jest.spyOn(fakeClient.videos, 'createEmbedCode');

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <ToastContainer />
        <EmbedButton video={video} />
      </BoclipsClientProvider>,
    );

    fireEvent.click(wrapper.getByRole('button', { name: 'embed' }));

    expect(createCodeSpy).toHaveBeenCalledWith(video);

    await waitFor(() => {
      // This is hardcoded in the api client, a bit coupled
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "<iframe src='https://api.staging-boclips.com/v1/embed-codes/embed-id'/>",
      );
    });
    const notification = await wrapper.findByRole('alert');
    expect(within(notification).getByText('Embed code copied!')).toBeVisible();
  });

  it(`shows tooltip when hovering on button`, () => {
    const video = VideoFactory.sample({});
    const fakeClient = new FakeBoclipsClient();
    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <ToastContainer />
        <EmbedButton video={video} />
      </BoclipsClientProvider>,
    );

    fireEvent.mouseOver(wrapper.getByRole('button', { name: 'embed' }));
    expect(screen.getByText('Copy embed code'));
  });
});
