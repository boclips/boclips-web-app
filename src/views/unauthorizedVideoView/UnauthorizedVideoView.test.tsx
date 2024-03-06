import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import UnauthorizedVideoView from 'src/views/unauthorizedVideoView/UnauthorizedVideoView';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { MemoryRouter } from 'react-router-dom';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import userEvent from '@testing-library/user-event';

describe('Video View', () => {
  it('renders thumbnail', async () => {
    const video = VideoFactory.sample({ id: 'video-id', title: 'NATO' });
    const apiClient = new FakeBoclipsClient();
    apiClient.videos.insertVideo(video);

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <MemoryRouter initialEntries={['/videos/shared/video-id?referer=id']}>
            <UnauthorizedVideoView />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    const thumbnail = await wrapper.findByAltText(`${video.title} thumbnail`);

    expect(thumbnail).toBeInTheDocument();
    expect(thumbnail.tagName).toBe('IMG');
    expect(wrapper.queryByText('AI generated')).not.toBeInTheDocument();
    expect(
      wrapper.queryByText('Explore similar videos'),
    ).not.toBeInTheDocument();
  });

  it('should display the share code modal for classroom video page', async () => {
    const video = VideoFactory.sample({ id: 'video-id', title: 'NATO' });
    const apiClient = new FakeBoclipsClient();
    apiClient.videos.insertVideo(video);
    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        id: 'id',
        shareCode: '123',
        firstName: 'rem',
        account: {
          id: 'id',
          name: 'account',
          type: AccountType.STANDARD,
          products: [Product.CLASSROOM],
          createdAt: new Date(),
        },
      }),
    );

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <MemoryRouter initialEntries={['/videos/shared/video-id?referer=id']}>
            <UnauthorizedVideoView />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.findByRole('dialog')).toBeVisible();
    expect(wrapper.getByText('Enter code to watch videos')).toBeVisible();
    expect(wrapper.getByPlaceholderText('Teacher code')).toBeVisible();
    expect(wrapper.getByText('Watch Video')).toBeVisible();
  });

  it('should remove the popup when correct share code is provided', async () => {
    const video = VideoFactory.sample({ id: 'video-id', title: 'NATO' });
    const apiClient = new FakeBoclipsClient();
    apiClient.videos.insertVideo(video);
    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        id: 'id',
        shareCode: '1234',
        firstName: 'rem',
        account: {
          id: 'id',
          name: 'account',
          type: AccountType.STANDARD,
          products: [Product.CLASSROOM],
          createdAt: new Date(),
        },
      }),
    );

    apiClient.videos.addValidShareCode('id', '1234');

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <MemoryRouter initialEntries={['/videos/shared/video-id?referer=id']}>
            <UnauthorizedVideoView />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.findByRole('dialog')).toBeVisible();

    const input = wrapper.getByPlaceholderText('Teacher code');
    const button = wrapper.getByRole('button', { name: 'Watch Video' });

    expect(button).toHaveAttribute('disabled');

    await userEvent.type(input, '1234');

    expect(button).not.toHaveAttribute('disabled');

    await userEvent.click(wrapper.getByRole('button', { name: 'Watch Video' }));

    await waitForElementToBeRemoved(() => wrapper.getByRole('dialog'));

    expect(wrapper.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
