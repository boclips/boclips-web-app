import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import React from 'react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';

import {
  FakeBoclipsClient,
  SubjectFactory,
} from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { Helmet } from 'react-helmet';
import { CartItemFactory } from 'boclips-api-client/dist/test-support/CartsFactory';
import { createReactQueryClient } from 'src/testSupport/createReactQueryClient';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';

describe('Video View', () => {
  let fakeClient;
  const exampleVideo = VideoFactory.sample({
    id: 'video-id',
    title: 'the coolest video you ever did see',
    description: 'this is so cool',
    subjects: [
      SubjectFactory.sample({
        name: 'history',
      }),
    ],
    ageRange: {
      min: 10,
      max: 14,
      label: '10 - 14',
    },
    releasedOn: new Date('2015-12-17'),
    createdBy: 'cool videos r us',
    price: {
      currency: 'USD',
      amount: 600,
    },
  });

  const renderVideoView = (initialEntries: string[]) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    fakeClient = new FakeBoclipsClient();
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        features: {
          BO_WEB_APP_ADDITIONAL_SERVICES: true,
          BO_WEB_APP_PRICES: true,
        },
      }),
    );
  });

  it('on video page video details are rendered', async () => {
    fakeClient.videos.insertVideo(exampleVideo);

    const wrapper = renderVideoView(['/videos/video-id']);

    expect(await wrapper.findByText('ID: video-id')).toBeVisible();
    expect(
      await wrapper.findByText('the coolest video you ever did see'),
    ).toBeVisible();

    expect(await wrapper.findByText('this is so cool')).toBeVisible();
    expect(
      await wrapper.findByText('This is an agreed price for your organization'),
    ).toBeVisible();
    expect(wrapper.queryByText('Ages 10-14')).not.toBeInTheDocument();
    expect(await wrapper.findByText('history')).toBeVisible();
    expect(await wrapper.findByText('cool videos r us')).toBeVisible();
    expect(
      await wrapper.findByText('Released on Dec 17, 2015 by'),
    ).toBeVisible();
    expect(await wrapper.findByLabelText('Copy video link')).toBeVisible();
    expect(await wrapper.findByText('Additional services')).toBeVisible();
  });

  it(`video page does not display additional services when disabled by user's feature`, async () => {
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        features: { BO_WEB_APP_ADDITIONAL_SERVICES: false },
      }),
    );

    fakeClient.videos.insertVideo(exampleVideo);

    const wrapper = renderVideoView(['/videos/video-id']);

    expect(await wrapper.findByText('ID: video-id')).toBeVisible();
    expect(wrapper.queryByText('Additional services')).toBeNull();
  });

  it(`video page does not display price info disabled by user's features`, async () => {
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        features: { BO_WEB_APP_PRICES: false },
      }),
    );

    fakeClient.videos.insertVideo(exampleVideo);

    const wrapper = renderVideoView(['/videos/video-id']);

    expect(await wrapper.findByText('ID: video-id')).toBeVisible();
    expect(
      wrapper.queryByText('This is an agreed price for your organization'),
    ).toBeNull();
  });

  it(`does not display add to cart button when user does not have cart link`, async () => {
    fakeClient.links.cart = null;
    fakeClient.videos.insertVideo(exampleVideo);

    const wrapper = renderVideoView(['/videos/video-id']);

    expect(await wrapper.findByText('ID: video-id')).toBeVisible();
    expect(wrapper.queryByText('Add to cart')).toBeNull();
  });

  it('copy to clipboard button is visible in the page', async () => {
    const video = VideoFactory.sample({
      id: 'video-id',
    });

    fakeClient.videos.insertVideo(video);

    const wrapper = renderVideoView(['/videos/video-id']);

    const button = await wrapper.findByLabelText('Copy video link');

    expect(button).toBeInTheDocument();
  });

  describe('back button', () => {
    it('does not render back button if user navigates directly to page', async () => {
      const video = VideoFactory.sample({
        id: 'video-3',
        title: 'the coolest video you ever did see',
      });

      fakeClient.videos.insertVideo(video);

      const wrapper = renderVideoView(['/videos/video-3']);

      await wrapper.findByText('the coolest video you ever did see');

      expect(wrapper.queryByText('Back')).not.toBeInTheDocument();
    });

    it('navigates back to previous page', async () => {
      const video = VideoFactory.sample({
        id: 'video-4',
        title: 'the coolest video you ever did see',
      });

      const cartItem = CartItemFactory.sample({
        videoId: 'video-4',
      });

      fakeClient.videos.insertVideo(video);
      fakeClient.carts.insertCartItem(cartItem);

      const wrapper = renderVideoView(['/cart']);

      const title = await wrapper.findByText(
        'the coolest video you ever did see',
      );

      act(() => {
        fireEvent.click(title);
      });

      await waitFor(async () => {
        expect(await wrapper.findByText('Back')).toBeVisible();
        expect(wrapper.queryByText('Shopping cart')).not.toBeInTheDocument();
      });

      const backButton = await wrapper.findByText('Back');

      act(() => {
        fireEvent.click(backButton);
      });

      await waitFor(async () =>
        expect(wrapper.getByText('Shopping cart')).toBeVisible(),
      );
    });
  });

  it('shows page not found if there isnt a video with a matching id', async () => {
    const originalConsoleError = console.error;
    console.error = () => {};

    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.videos.insertVideo(
      VideoFactory.sample({
        id: 'valid-video-id',
      }),
    );

    const wrapper = renderVideoView(['/videos/invalid-video-id']);
    expect(await wrapper.findByText('Page not found!')).toBeVisible();
    expect(
      await wrapper.findByRole('button', { name: 'Contact Support' }),
    ).toBeVisible();

    console.error = originalConsoleError;
  });

  describe('window titles', () => {
    it('displays video title as window title', async () => {
      const video = VideoFactory.sample({
        id: 'video-1',
        title: 'the coolest video you ever did see',
      });

      fakeClient.videos.insertVideo(video);

      const wrapper = renderVideoView(['/videos/video-1']);

      expect(
        await wrapper.findByText('the coolest video you ever did see'),
      ).toBeVisible();

      const helmet = Helmet.peek();
      expect(helmet.title).toEqual('the coolest video you ever did see');
    });

    it('displays default window title when no video available', async () => {
      const originalConsoleError = console.error;
      console.error = () => {};
      const wrapper = render(
        <MemoryRouter initialEntries={['/videos/video-2']}>
          <App
            apiClient={new FakeBoclipsClient()}
            boclipsSecurity={stubBoclipsSecurity}
          />
        </MemoryRouter>,
      );

      expect(await wrapper.findByText('Page not found!')).toBeVisible();
      const helmet = Helmet.peek();
      expect(helmet.title).toEqual('Boclips');
      console.error = originalConsoleError;
    });
  });
});
