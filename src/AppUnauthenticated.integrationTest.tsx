import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import AppUnauthenticated from 'src/AppUnauthenticated';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';

describe('Unauthenticated app', () => {
  it('renders registration view without authentication', async () => {
    const apiClient = new FakeBoclipsClient();

    const wrapper = render(
      <MemoryRouter initialEntries={['/register']}>
        <AppUnauthenticated axiosApiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Create your account')).toBeVisible();
  });

  it('renders video page view', async () => {
    const apiClient = new FakeBoclipsClient();

    apiClient.videos.insertVideo(
      VideoFactory.sample({ id: 'video-id', title: 'Awesome video' }),
    );

    const wrapper = render(
      <MemoryRouter
        initialEntries={['/videos/shared/video-id?referer=some-referer']}
      >
        <AppUnauthenticated axiosApiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Awesome video')).toBeVisible();
  });

  it('renders playlist page view', async () => {
    const apiClient = new FakeBoclipsClient();

    const wrapper = render(
      <MemoryRouter
        initialEntries={['/playlists/shared/playlist-id?referer=some-referer']}
      >
        <AppUnauthenticated axiosApiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(
      await wrapper.findByTitle('playlist skeleton unauthorized'),
    ).toBeVisible();
  });
});
