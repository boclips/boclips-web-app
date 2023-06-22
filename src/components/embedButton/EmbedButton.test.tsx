import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { EmbedButton } from 'src/components/embedButton/EmbedButton';
import React from 'react';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';

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
        "<iframe src='https://api.staging-boclips.com/v1/embeds/embed-id/view'/>",
      );
    });
    const notification = await wrapper.findByRole('alert');
    expect(within(notification).getByText('Embed code copied!')).toBeVisible();
  });

  it(`shows tooltip when hovering on button and no label`, async () => {
    const video = VideoFactory.sample({});
    const fakeClient = new FakeBoclipsClient();
    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <ToastContainer />
        <EmbedButton video={video} iconOnly />
      </BoclipsClientProvider>,
    );

    await userEvent.hover(wrapper.getByRole('button', { name: 'embed' }));

    await waitFor(() => {
      expect(wrapper.getByRole('tooltip')).toBeInTheDocument();
      expect(wrapper.getAllByText('Get embed code')).toHaveLength(2);
    });
  });
});
