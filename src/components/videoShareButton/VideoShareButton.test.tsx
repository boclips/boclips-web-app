import { render } from '@testing-library/react';
import { VideoShareButton } from 'src/components/videoShareButton/VideoShareButton';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import dayjs from 'src/day-js';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';

describe('video share button', () => {
  it(`renders label when iconOnly false`, async () => {
    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <VideoShareButton video={VideoFactory.sample({})} />
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
          <VideoShareButton iconOnly video={VideoFactory.sample({})} />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );
    expect(await wrapper.findByTestId('share-button')).toBeVisible();
    expect(wrapper.queryByText('Share')).toBeNull();
  });

  it(`displays modal with title when clicked`, async () => {
    const wrapper = renderShareButton();

    const button = await wrapper.findByRole('button', { name: 'Share' });
    await userEvent.click(button);

    expect(
      await wrapper.findByText('Share Tractor Video with students'),
    ).toBeVisible();
    expect(
      wrapper.getByRole('button', {
        name: 'Close Share Tractor Video with students modal',
      }),
    ).toBeVisible();
    expect(wrapper.getByRole('button', { name: 'Copy link' })).toBeVisible();

    const shareCodeFooter = wrapper.getByTestId('share-code-footer');
    expect(shareCodeFooter).toBeVisible();
    expect(shareCodeFooter.textContent).toEqual(
      'Your unique Teacher code is 1739',
    );

    expect(wrapper.queryByRole('button', { name: 'Cancel' })).toBeNull();
  });

  it(`allows selecting start and end time for shared link`, async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        shareCode: '1739',
      }),
    );

    const wrapper = renderShareButton();

    const button = await wrapper.findByRole('button', { name: 'Share' });
    await userEvent.click(button);

    expect(
      await wrapper.findByText('Share Tractor Video with students'),
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

  it(`end time is defaulted to end of video`, async () => {
    const wrapper = renderShareButton();

    const button = await wrapper.findByRole('button', { name: 'Share' });
    await userEvent.click(button);

    expect(
      await wrapper.findByText('Share Tractor Video with students'),
    ).toBeVisible();

    const endTimeInput = wrapper.getByRole('textbox', {
      name: 'End time:',
    });
    expect(endTimeInput).toBeVisible();
    expect(endTimeInput).toBeDisabled();

    expect((endTimeInput as HTMLInputElement).value).toEqual('01:10');
  });

  it(`validates start time > end time`, async () => {
    const wrapper = renderShareButton();
    await openShareModal(wrapper);
    expect(
      await wrapper.findByText('Share Tractor Video with students'),
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
  });
});

const renderShareButton = () => {
  const apiClient = new FakeBoclipsClient();
  apiClient.users.insertCurrentUser(
    UserFactory.sample({
      shareCode: '1739',
    }),
  );

  return render(
    <QueryClientProvider client={new QueryClient()}>
      <BoclipsClientProvider client={apiClient}>
        <VideoShareButton
          iconOnly
          video={VideoFactory.sample({
            title: 'Tractor Video',
            playback: PlaybackFactory.sample({
              duration: dayjs.duration({ minutes: 1, seconds: 10 }),
            }),
          })}
        />
      </BoclipsClientProvider>
    </QueryClientProvider>,
  );
};
const openShareModal = async (wrapper) => {
  const button = await wrapper.findByRole('button', { name: 'Share' });
  await userEvent.click(button);
};
