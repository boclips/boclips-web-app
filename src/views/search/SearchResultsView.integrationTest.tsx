import { fireEvent, render, waitFor } from '@testing-library/react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import App from 'src/App';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import {
  FacetFactory,
  FacetsFactory,
} from 'boclips-api-client/dist/test-support/FacetsFactory';
import Navbar from 'src/components/layout/Navbar';
import { QueryClient, QueryClientProvider } from 'react-query';
import { queryClientConfig } from 'src/hooks/api/queryClientConfig';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { Helmet } from 'react-helmet';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';

describe('SearchResults', () => {
  beforeEach(() => {
    window.resizeTo(1680, 1024);
  });

  it('renders a list of videos that match the search query', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.insertCurrentUser(UserFactory.sample());
    const videos = [
      VideoFactory.sample({ id: '1', title: '1' }),
      VideoFactory.sample({
        title: 'hello i am a title',
        description: 'wow what a video hansen',
        ageRange: {
          min: 7,
          max: 9,
        },
        releasedOn: new Date('2019-03-20'),
        createdBy: 'BFI',
        subjects: [
          {
            id: '123',
            name: 'geography',
          },
        ],
        playback: PlaybackFactory.sample({
          type: 'YOUTUBE',
        }),
      }),
    ];

    videos.forEach((v) => fakeClient.videos.insertVideo(v));

    const wrapper = render(
      <MemoryRouter initialEntries={['/videos?q=hello']}>
        <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(wrapper.getByText('hello i am a title')).toBeVisible();
      expect(wrapper.getByText('wow what a video hansen')).toBeVisible();
      expect(wrapper.getByText('20 Mar 2019')).toBeVisible();
      expect(wrapper.getByText('BFI')).toBeVisible();
      expect(wrapper.getByText('geography')).toBeVisible();
      expect(wrapper.queryByText('Ages 7-9')).not.toBeInTheDocument();
      expect(wrapper.queryByText('Selected filters')).not.toBeInTheDocument();
    });
  });

  it('renders a hits count that is updated after new search', async () => {
    const fakeClient = new FakeBoclipsClient();
    const videos = [
      VideoFactory.sample({ id: '1', title: 'art' }),
      VideoFactory.sample({
        id: '2',
        title: 'artistic',
      }),
    ];

    videos.forEach((v) => fakeClient.videos.insertVideo(v));

    const wrapper = render(
      <MemoryRouter initialEntries={['/videos?q=art']}>
        <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect((await wrapper.findByTestId('search-hits')).textContent).toEqual(
      '2',
    );

    const searchBar = wrapper.getByPlaceholderText(
      'Search for videos',
    ) as HTMLInputElement;

    fireEvent.change(searchBar, { target: { value: 'artist' } });
    fireEvent.keyDown(searchBar, { key: 'Enter', code: 'Enter' });

    expect((await wrapper.findByTestId('search-hits')).textContent).toEqual(
      '1',
    );
  });

  it('can search for a new query', async () => {
    const fakeClient = new FakeBoclipsClient();
    const videos = [
      VideoFactory.sample({
        id: '1',
        title: 'dogs',
        description: 'dogs are nice',
      }),
      VideoFactory.sample({
        id: '2',
        title: 'cats',
        description: 'cats have nine lives',
      }),
    ];

    videos.forEach((v) => fakeClient.videos.insertVideo(v));

    const wrapper = render(
      <MemoryRouter initialEntries={['/videos?q=dogs']}>
        <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('dogs are nice')).toBeVisible();

    const searchBar = wrapper.getByPlaceholderText(
      'Search for videos',
    ) as HTMLInputElement;

    fireEvent.change(searchBar, { target: { value: 'cats' } });
    fireEvent.keyDown(searchBar, { key: 'Enter', code: 'Enter' });

    expect(await wrapper.findByText('cats have nine lives')).toBeVisible();
    expect(wrapper.queryByText('dogs are nice')).not.toBeInTheDocument();
  });

  it('renders the pagination', async () => {
    const fakeClient = new FakeBoclipsClient();

    const videos = [];
    for (let i = 0; i < 31; i++) {
      videos.push(
        VideoFactory.sample({
          id: `${i}`,
          title: `video ${i}`,
        }),
      );
    }

    videos.forEach((v) => fakeClient.videos.insertVideo(v));

    const wrapper = render(
      <MemoryRouter initialEntries={['/videos?q=video']}>
        <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(wrapper.getByText('video 0')).toBeVisible();
      expect(wrapper.queryByText('video 30')).not.toBeInTheDocument();
    });

    fireEvent.click(wrapper.getByText('2'));

    await waitFor(() => {
      expect(wrapper.getByText('video 30')).toBeVisible();
      expect(wrapper.queryByText('video 0')).not.toBeInTheDocument();
    });
  });

  it('persists queries between pages', async () => {
    const fakeClient = new FakeBoclipsClient();

    for (let i = 0; i < 31; i++) {
      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: `video ${i}`,
          title: `video ${i}`,
          types: [{ id: 1, name: 'NEWS' }],
        }),
      );
    }
    fakeClient.videos.setFacets(
      FacetsFactory.sample({
        videoTypes: [
          FacetFactory.sample({ name: 'News', id: 'NEWS', hits: 1 }),
        ],
      }),
    );

    const wrapper = render(
      <MemoryRouter initialEntries={['/videos?q=video']}>
        <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    fireEvent.click(await wrapper.findByTestId('NEWS-checkbox'));
    expect(wrapper.getByTestId('NEWS-checkbox')).toHaveProperty(
      'checked',
      true,
    );

    expect(await wrapper.findByText('video 0')).toBeVisible();
    expect(wrapper.queryByText('video 30')).not.toBeInTheDocument();

    fireEvent.click(wrapper.getByText('2'));

    expect(wrapper.getByTestId('NEWS-checkbox')).toHaveProperty(
      'checked',
      true,
    );

    await waitFor(() => {
      expect(wrapper.getByText('video 30')).toBeVisible();
      expect(wrapper.queryByText('video 0')).not.toBeInTheDocument();
    });
  });

  it('directs to video page when card is clicked', async () => {
    const fakeClient = new FakeBoclipsClient();

    const video = VideoFactory.sample({
      id: 'video-id',
      title: 'news video',
      types: [{ name: 'NEWS', id: 2 }],
    });

    fakeClient.videos.insertVideo(video);

    const wrapper = render(
      <MemoryRouter initialEntries={['/videos?q=vid']}>
        <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    const newsVideo = await wrapper.findByText(/news video/);

    expect(newsVideo.closest('a')).toHaveAttribute('href', '/videos/video-id');
  });

  describe('cart in video-card', () => {
    it('displays add to cart button', async () => {
      const fakeClient = new FakeBoclipsClient();

      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: '2',
          title: 'news video',
          types: [{ name: 'NEWS', id: 2 }],
        }),
      );

      const wrapper = render(
        <MemoryRouter initialEntries={['/videos?q=video']}>
          <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} />
        </MemoryRouter>,
      );

      expect(await wrapper.findByText('Add to cart')).toBeVisible();
    });

    it('adds and removes item from cart when clicked', async () => {
      const fakeClient = new FakeBoclipsClient();

      const video = VideoFactory.sample({
        id: 'video-id',
        title: 'news video',
        types: [{ name: 'NEWS', id: 2 }],
      });

      fakeClient.videos.insertVideo(video);

      const wrapper = render(
        <MemoryRouter initialEntries={['/videos?q=vid']}>
          <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} />
        </MemoryRouter>,
      );

      expect(await wrapper.findByText('Add to cart')).toBeInTheDocument();

      fireEvent(
        wrapper.getByText('Add to cart'),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );

      const cart = await fakeClient.carts.getCart();

      await waitFor(() => {
        expect(cart.items).toHaveLength(1);
      });

      expect(wrapper.getByText('Remove')).toBeInTheDocument();
      const addNotification = wrapper.getByTestId(
        'add-video-1-to-cart-notification',
      );
      expect(addNotification).toBeVisible();
      expect(addNotification.children.item(0).textContent).toEqual(
        'Video added to cart',
      );

      fireEvent(
        wrapper.getByText('Remove'),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );

      await waitFor(() => {
        expect(cart.items).toHaveLength(0);
      });
      const removeNotification = wrapper.getByTestId(
        'remove-video-1-from-cart-notification',
      );
      expect(removeNotification).toBeVisible();
      expect(removeNotification.children.item(0).textContent).toEqual(
        'Video removed from cart',
      );
    });

    it('basket counter goes up when item added to cart in navbar', async () => {
      const fakeClient = new FakeBoclipsClient();

      const video = VideoFactory.sample({
        id: 'video-id',
        title: 'news video',
        types: [{ name: 'NEWS', id: 2 }],
      });

      fakeClient.videos.insertVideo(video);

      const wrapper = render(
        <MemoryRouter initialEntries={['/videos?q=vid']}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <BoclipsClientProvider client={fakeClient}>
              <QueryClientProvider client={new QueryClient(queryClientConfig)}>
                <Navbar />
              </QueryClientProvider>
            </BoclipsClientProvider>
          </BoclipsSecurityProvider>
        </MemoryRouter>,
      );

      fakeClient.carts.insertCartItem({ videoId: 'video-id' });
      const cart = await fakeClient.carts.getCart();

      await waitFor(() => {
        const cartCounter = wrapper.getByTestId('cart-counter').innerHTML;
        expect(cartCounter).toBe(cart.items.length.toString());
      });
    });
  });

  describe('window titles', () => {
    it('displays search query in window title', async () => {
      render(
        <MemoryRouter initialEntries={['/videos?q=hello']}>
          <App
            apiClient={new FakeBoclipsClient()}
            boclipsSecurity={stubBoclipsSecurity}
          />
        </MemoryRouter>,
      );

      const helmet = Helmet.peek();

      await waitFor(() => {
        expect(helmet.title).toEqual('hello videos');
      });
    });

    it('displays default title when no query present', async () => {
      render(
        <MemoryRouter initialEntries={['/videos']}>
          <App
            apiClient={new FakeBoclipsClient()}
            boclipsSecurity={stubBoclipsSecurity}
          />
        </MemoryRouter>,
      );

      const helmet = Helmet.peek();

      await waitFor(() => {
        expect(helmet.title).toEqual('Boclips');
      });
    });
  });
});
