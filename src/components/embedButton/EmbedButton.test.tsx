import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { render, RenderResult, waitFor, within } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { EmbedButton } from '@components/embedButton/EmbedButton';
import React from 'react';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import LicensedContentFactory from 'boclips-api-client/dist/test-support/LicensedContentFactory';
import { Link } from 'boclips-api-client/dist/types';
import { BoclipsClient } from 'boclips-api-client/dist/BoclipsClient';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';

describe(`embed button`, () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });

  it('displays embed modal on click', async () => {
    const video = VideoFactory.sample({});
    const fakeClient = new FakeBoclipsClient();
    const wrapper = renderEmbedButton(fakeClient, video);

    await openEmbedModal(wrapper);

    expect(wrapper.getByRole('dialog')).toBeInTheDocument();
    expect(wrapper.getByText('Copy embed code')).toBeVisible();
  });

  it(`copies the embed video to clipboard on click when video passed in`, async () => {
    vi.spyOn(navigator.clipboard, 'writeText');

    const video = VideoFactory.sample({});
    const fakeClient = new FakeBoclipsClient();
    const createCodeSpy = vi.spyOn(fakeClient.videos, 'createEmbedCode');
    const onClickSpy = vi.fn();

    const wrapper = renderEmbedButton(fakeClient, video, null, onClickSpy);
    await openEmbedModal(wrapper);

    expect(await wrapper.findByText('Copy embed code')).toBeVisible();
    const startTimeInput = wrapper.getByRole('textbox', {
      name: 'Start time:',
    });
    await userEvent.click(
      wrapper.getByRole('checkbox', {
        name: 'Start time enabled',
        checked: false,
      }),
    );

    const endTimeInput = wrapper.getByRole('textbox', {
      name: 'End time:',
    });
    await userEvent.click(
      wrapper.getByRole('checkbox', {
        name: 'End time enabled',
        checked: false,
      }),
    );

    await userEvent.clear(startTimeInput);
    await userEvent.type(startTimeInput, '00:10');

    await userEvent.clear(endTimeInput);
    await userEvent.type(endTimeInput, '00:32');

    await userEvent.click(
      await wrapper.findByRole('button', { name: 'Copy embed' }),
    );

    expect(createCodeSpy).toHaveBeenCalledWith(video, 10, 32);

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
    vi.spyOn(navigator.clipboard, 'writeText');
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
    const createCodeSpy = vi.spyOn(fakeClient.licenses, 'createEmbedCode');
    const onClickSpy = vi.fn();

    const wrapper = renderEmbedButton(
      fakeClient,
      null,
      licensedContent,
      onClickSpy,
    );
    await openEmbedModal(wrapper);

    expect(await wrapper.findByText('Copy embed code')).toBeVisible();
    const startTimeInput = wrapper.getByRole('textbox', {
      name: 'Start time:',
    });
    await userEvent.click(
      wrapper.getByRole('checkbox', {
        name: 'Start time enabled',
        checked: false,
      }),
    );

    const endTimeInput = wrapper.getByRole('textbox', {
      name: 'End time:',
    });
    await userEvent.click(
      wrapper.getByRole('checkbox', {
        name: 'End time enabled',
        checked: false,
      }),
    );

    await userEvent.clear(startTimeInput);
    await userEvent.type(startTimeInput, '00:07');

    await userEvent.clear(endTimeInput);
    await userEvent.type(endTimeInput, '01:04');

    await userEvent.click(
      await wrapper.findByRole('button', { name: 'Copy embed' }),
    );

    expect(createCodeSpy).toHaveBeenCalledWith(licensedContent, 7, 64);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('embed');
    });
    const notification = await wrapper.findByRole('alert');
    expect(
      within(notification).getByText('Embed video code is copied!'),
    ).toBeVisible();
    expect(onClickSpy).toHaveBeenCalledTimes(1);
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

const renderEmbedButton = (
  client: BoclipsClient,
  video?: Video,
  licensedContent?: LicensedContent,
  onClick?: () => void,
) => {
  return render(
    <BoclipsClientProvider client={client}>
      <ToastContainer />
      <EmbedButton
        video={video}
        licensedContent={licensedContent}
        onClick={onClick}
      />
    </BoclipsClientProvider>,
  );
};

const openEmbedModal = async (wrapper: RenderResult) => {
  const button = await wrapper.findByRole('button', { name: 'Embed' });
  await userEvent.click(button);
};
