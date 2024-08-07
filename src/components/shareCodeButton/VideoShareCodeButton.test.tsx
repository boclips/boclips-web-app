import { render, RenderResult, waitFor, within } from '@testing-library/react';
import { VideoShareCodeButton } from 'src/components/shareCodeButton/VideoShareCodeButton';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import dayjs from 'src/day-js';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import { getShareableVideoLink } from 'src/components/shareCodeButton/getShareableLink';
import { ToastContainer } from 'react-toastify';

describe('video share code button', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });

  it(`renders label when iconOnly false`, async () => {
    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <VideoShareCodeButton video={VideoFactory.sample({})} />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.findByTestId('share-button')).toBeVisible();
    expect(await wrapper.findByText('Share')).toBeVisible();
  });

  it(`doesn't render label when iconOnly`, async () => {
    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <VideoShareCodeButton iconOnly video={VideoFactory.sample({})} />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.findByTestId('share-button')).toBeVisible();
    expect(wrapper.queryByText('Share')).toBeNull();
  });

  it('displays share code modal on click', async () => {
    const wrapper = renderShareButton();
    await openShareModal(wrapper);

    expect(wrapper.getByRole('dialog')).toBeInTheDocument();
    expect(wrapper.getByText('Share this video with students')).toBeVisible();

    const body = wrapper.getByTestId('share-code-body');
    expect(body).toBeVisible();
    expect(body.textContent).toEqual(
      'Students need both the link and your unique access code to access and play the video Tractor Video',
    );

    const footer = await wrapper.findByTestId('share-code-footer');
    expect(footer).toBeVisible();
    expect(footer.textContent).toEqual('Your unique access code is 1739');
  });

  it(`allows selecting start and end time for shared link`, async () => {
    const wrapper = renderShareButton();
    await openShareModal(wrapper);

    expect(
      await wrapper.findByText('Share this video with students'),
    ).toBeVisible();

    const startCheckbox = wrapper.getByRole('checkbox', {
      name: 'Start time enabled',
      checked: false,
    });
    expect(startCheckbox).toBeVisible();

    const startTimeInput = wrapper.getByRole('textbox', {
      name: 'Start time:',
    });
    expect(startTimeInput).toBeVisible();
    expect(startTimeInput).toBeDisabled();

    await userEvent.click(startCheckbox);

    expect(startTimeInput).toBeEnabled();

    const endCheckbox = wrapper.getByRole('checkbox', {
      name: 'End time enabled',
      checked: false,
    });
    expect(endCheckbox).toBeVisible();

    const endTimeInput = wrapper.getByRole('textbox', {
      name: 'End time:',
    });
    expect(endTimeInput).toBeVisible();
    expect(endTimeInput).toBeDisabled();

    await userEvent.click(endCheckbox);

    expect(endTimeInput).toBeEnabled();
  });

  it(`validates start time > end time`, async () => {
    jest.spyOn(navigator.clipboard, 'writeText');

    const wrapper = renderShareButton();
    await openShareModal(wrapper);

    expect(
      await wrapper.findByText('Share this video with students'),
    ).toBeVisible();
    const startTimeInput = wrapper.getByRole('textbox', {
      name: 'Start time:',
    });
    await userEvent.click(
      wrapper.getByRole('checkbox', {
        name: 'Start time enabled',
        checked: false,
      }),
    );
    await userEvent.type(startTimeInput, '00:10');

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
    await userEvent.type(endTimeInput, '00:02');

    await userEvent.tab();

    expect(
      await wrapper.findByText('Please enter valid start and end times'),
    ).toBeVisible();

    await userEvent.click(
      await wrapper.findByRole('button', { name: 'Copy link' }),
    );

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();

    expect(wrapper.queryByRole('alert')).toBeNull();

    expect(
      await wrapper.findByText('Share this video with students'),
    ).toBeVisible();
  });

  it(`copies share link but doesn't close modal on clicking main button`, async () => {
    const apiClient = new FakeBoclipsClient();

    jest.spyOn(navigator.clipboard, 'writeText');
    const trackVideoSpy = jest.spyOn(
      apiClient.shareCodes,
      'trackVideoShareCode',
    );
    // @ts-ignore
    apiClient.shareCodes.trackVideoShareCode = trackVideoSpy;
    const wrapper = renderShareButton(apiClient);
    await openShareModal(wrapper);

    expect(
      await wrapper.findByText('Share this video with students'),
    ).toBeVisible();
    const startTimeInput = wrapper.getByRole('textbox', {
      name: 'Start time:',
    });
    await userEvent.click(
      wrapper.getByRole('checkbox', {
        name: 'Start time enabled',
        checked: false,
      }),
    );
    await userEvent.type(startTimeInput, '00:10');

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
      await wrapper.findByRole('button', { name: 'Copy link' }),
    );
    expect(trackVideoSpy).toHaveBeenCalledWith('video-1');

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      getShareableVideoLink('video-1', 'user-1', 10, 32),
    );

    const notification = await wrapper.findByRole('alert');
    expect(within(notification).getByText('Share link copied!')).toBeVisible();

    expect(
      await wrapper.findByText('Share this video with students'),
    ).toBeVisible();
  });

  it(`includes a link to google classroom`, async () => {
    const wrapper = renderShareButton();
    await openShareModal(wrapper);

    expect(
      await wrapper.findByRole('link', {
        name: 'Share to Google Classroom',
      }),
    ).toBeVisible();
  });

  it('removes the tabIndex on main element, to allow copying the text', async () => {
    const wrapper = renderShareButton();

    expect(wrapper.getByRole('main')).toHaveAttribute('tabIndex', '-1');

    await openShareModal(wrapper);

    await waitFor(() =>
      expect(wrapper.getByRole('main')).not.toHaveAttribute('tabIndex'),
    );
  });
});

const renderShareButton = (
  apiClient: FakeBoclipsClient = new FakeBoclipsClient(),
) => {
  apiClient.users.insertCurrentUser(
    UserFactory.sample({
      id: 'user-1',
      shareCode: '1739',
    }),
  );

  return render(
    <main tabIndex={-1}>
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <ToastContainer />
          <VideoShareCodeButton
            iconOnly
            video={VideoFactory.sample({
              id: 'video-1',
              title: 'Tractor Video',
              playback: PlaybackFactory.sample({
                duration: dayjs.duration({ minutes: 1, seconds: 10 }),
              }),
            })}
          />
        </BoclipsClientProvider>
      </QueryClientProvider>
    </main>,
  );
};

const openShareModal = async (wrapper: RenderResult) => {
  const button = await wrapper.findByRole('button', { name: 'Share' });
  await userEvent.click(button);
};
