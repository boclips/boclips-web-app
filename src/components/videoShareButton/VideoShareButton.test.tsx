import { render } from '@testing-library/react';
import { VideoShareButton } from 'src/components/videoShareButton/VideoShareButton';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';

describe('video share button', () => {
  it(`renders label when iconOnly false`, async () => {
    const wrapper = render(
      <VideoShareButton video={VideoFactory.sample({})} />,
    );
    expect(await wrapper.findByTestId('share-button')).toBeVisible();
    expect(await wrapper.findByText('Share')).toBeVisible();
  });

  it(`doesn't render label when iconOnly`, async () => {
    const wrapper = render(
      <VideoShareButton iconOnly video={VideoFactory.sample({})} />,
    );
    expect(await wrapper.findByTestId('share-button')).toBeVisible();
    expect(wrapper.queryByText('Share')).toBeNull();
  });

  it(`displays modal with title when clicked`, async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        shareCode: '1739',
      }),
    );

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <VideoShareButton
            iconOnly
            video={VideoFactory.sample({ title: 'Tractor Video' })}
          />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

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
    expect(wrapper.getByText('Your unique teacher code is 1739')).toBeVisible();
    expect(wrapper.queryByRole('button', { name: 'Cancel' })).toBeNull();
  });

  it(`allows selecting start and end time for shared link`, async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        shareCode: '1739',
      }),
    );

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <VideoShareButton
            iconOnly
            video={VideoFactory.sample({ title: 'Tractor Video' })}
          />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

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
  });
});
