import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { EmbedButton } from 'src/components/embedButton/EmbedButton';
import React from 'react';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import LicensedContentFactory from 'boclips-api-client/dist/test-support/LicensedContentFactory';
import { Link } from 'boclips-api-client/dist/types';

describe(`embed button`, () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });

  it(`copies the embed video to clipboard on click when video passed in`, async () => {
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

    fireEvent.click(wrapper.getByRole('button', { name: 'Embed' }));

    expect(createCodeSpy).toHaveBeenCalledWith(video);

    await waitFor(() => {
      // This is hardcoded in the api client, a bit coupled
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "<iframe src='https://api.staging-boclips.com/v1/embeds/embed-id/view'/>",
      );
    });
    const notification = await wrapper.findByRole('alert');
    expect(
      within(notification).getByText('Embed video code is copied!'),
    ).toBeVisible();
  });

  it(`calls onClick when clicked`, async () => {
    jest.spyOn(navigator.clipboard, 'writeText');

    const video = VideoFactory.sample({});
    const fakeClient = new FakeBoclipsClient();
    const onClickSpy = jest.fn();
    const createCodeSpy = jest.spyOn(fakeClient.videos, 'createEmbedCode');

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <ToastContainer />
        <EmbedButton video={video} onClick={onClickSpy} />
      </BoclipsClientProvider>,
    );

    fireEvent.click(wrapper.getByRole('button', { name: 'Embed' }));

    expect(createCodeSpy).toHaveBeenCalledWith(video);

    await waitFor(() => {
      // This is hardcoded in the api client, a bit coupled
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "<iframe src='https://api.staging-boclips.com/v1/embeds/embed-id/view'/>",
      );
    });
    const notification = await wrapper.findByRole('alert');
    expect(
      within(notification).getByText('Embed video code is copied!'),
    ).toBeVisible();
    expect(onClickSpy).toHaveBeenCalledTimes(1);
  });

  it(`copies the embed code to clipboard on click when licensedContent passed in`, async () => {
    jest.spyOn(navigator.clipboard, 'writeText');
    const licensedContent = LicensedContentFactory.sample({
      videoId: 'video-id',
      videoMetadata: {
        ...LicensedContentFactory.sample({}).videoMetadata,
        links: {
          self: new Link({ href: 'link', templated: false }),
          createEmbedCode: new Link({
            href: 'createEmbed',
            templated: false,
          }),
        },
      },
    });
    const fakeClient = new FakeBoclipsClient();
    fakeClient.licenses.insertEmbedForVideo('embed', 'video-id');
    const createCodeSpy = jest.spyOn(fakeClient.licenses, 'createEmbedCode');

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <ToastContainer />
        <EmbedButton licensedContent={licensedContent} />
      </BoclipsClientProvider>,
    );

    fireEvent.click(wrapper.getByRole('button', { name: 'Embed' }));

    expect(createCodeSpy).toHaveBeenCalledWith(licensedContent);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('embed');
    });
    const notification = await wrapper.findByRole('alert');
    expect(
      within(notification).getByText('Embed video code is copied!'),
    ).toBeVisible();
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

    await userEvent.hover(wrapper.getByRole('button', { name: 'Embed' }));

    await waitFor(() => {
      expect(wrapper.getByRole('tooltip')).toBeInTheDocument();
      expect(wrapper.getAllByText('Embed video')).toHaveLength(2);
    });
  });
});
