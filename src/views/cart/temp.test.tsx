import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { QueryClient } from '@tanstack/react-query';
import { queryClientConfig } from 'src/hooks/api/queryClientConfig';
import React from 'react';

describe('1', () => {
  const video = VideoFactory.sample({
    id: 'video-id',
    title: 'news video',
    price: {
      amount: 600,
      currency: 'USD',
    },
    types: [{ name: 'NEWS', id: 2 }],
  });
  const instructionalVideo = VideoFactory.sample({
    id: 'instructional-video-id',
    title: 'instructional video',
    price: {
      amount: 400,
      currency: 'USD',
    },
    types: [{ name: 'INSTRUCTIONAL', id: 3 }],
  });

  beforeEach(() => {
    window.resizeTo(1680, 1024);
  });

  it('test', async () => {
    const fakeClient = new FakeBoclipsClient();
    const queryClient = new QueryClient();

    // fakeClient.videos.insertVideo(video);
    // fakeClient.videos.insertVideo(instructionalVideo);
    // fakeClient.carts.insertCartItem({
    //   videoId: 'video-id',
    // });
    // fakeClient.carts.insertCartItem({ videoId: 'instructional-video-id' });
    // fakeClient.users.setCurrentUserFeatures({
    //   BO_WEB_APP_REQUEST_TRIMMING: true,
    //   BO_WEB_APP_PRICES: true,
    // });

    const wrapper = render(
      <MemoryRouter initialEntries={['/cart']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={queryClient}
        />
      </MemoryRouter>,
    );

    // await waitForElementToBeRemoved(() => wrapper.getByText('Loading'));

    wrapper.debug();
  });
});
