import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import AppUnauthenticated from 'src/AppUnauthenticated';
import { CollectionFactory } from 'boclips-api-client/dist/test-support/CollectionsFactory';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';

describe('Unauthenticated app', () => {
  describe('library registration', () => {
    it('renders registration view without authentication', async () => {
      const apiClient = new FakeBoclipsClient();

      const wrapper = render(
        <MemoryRouter initialEntries={['/register']}>
          <AppUnauthenticated axiosApiClient={apiClient} />,
        </MemoryRouter>,
      );

      expect(await wrapper.findByText('Create your account')).toBeVisible();
    });
  });

  describe('classroom registration', () => {
    it('renders registration view without authentication', async () => {
      const apiClient = new FakeBoclipsClient();

      const wrapper = render(
        <MemoryRouter initialEntries={['/classroom/register']}>
          <AppUnauthenticated axiosApiClient={apiClient} />,
        </MemoryRouter>,
      );

      expect(await wrapper.findByText('Create a trial account')).toBeVisible();
    });
  });

  describe('video page', () => {
    it('renders video page view', async () => {
      const apiClient = new FakeBoclipsClient();

      apiClient.videos.insertVideo(
        VideoFactory.sample({ id: 'video-id', title: 'Awesome video' }),
      );
      apiClient.videos.addValidReferer('some-referer');

      const wrapper = render(
        <MemoryRouter
          initialEntries={['/videos/shared/video-id?referer=some-referer']}
        >
          <AppUnauthenticated axiosApiClient={apiClient} />,
        </MemoryRouter>,
      );

      expect(await wrapper.findByText('Awesome video')).toBeVisible();
    });
  });

  describe('playlist page', () => {
    it('renders playlist page view', async () => {
      const apiClient = new FakeBoclipsClient();

      apiClient.collections.addToFake(
        CollectionFactory.sample({
          id: 'playlist-id',
          title: 'Awesome playlist',
        }),
      );
      apiClient.collections.addValidReferer('some-referer');

      const wrapper = render(
        <MemoryRouter
          initialEntries={[
            '/playlists/shared/playlist-id?referer=some-referer',
          ]}
        >
          <AppUnauthenticated axiosApiClient={apiClient} />,
        </MemoryRouter>,
      );

      expect(await wrapper.findAllByText('Awesome playlist')).not.toHaveLength(
        0,
      );
    });

    it('renders page not found when there is no referer', async () => {
      const apiClient = new FakeBoclipsClient();

      const wrapper = render(
        <MemoryRouter initialEntries={['/playlists/shared/playlist-id']}>
          <AppUnauthenticated axiosApiClient={apiClient} />,
        </MemoryRouter>,
      );

      expect(await wrapper.findByText('Page not found!')).toBeVisible();
    });
  });
});
