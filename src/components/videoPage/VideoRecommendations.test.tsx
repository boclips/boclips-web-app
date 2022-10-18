import { fireEvent, waitFor } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import React from 'react';
import VideoRecommendations from 'src/components/videoPage/VideoRecommendations';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { render } from 'src/testSupport/render';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { BoclipsClientProvider } from '../common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from '../common/providers/BoclipsSecurityProvider';

describe('video recommendations', () => {
  let apiClient: FakeBoclipsClient;
  const mainId = 'main id';
  const recTitle = 'How to install a kitchen sink in Emacs?';
  const mixpanelTrack = jest.spyOn(AnalyticsFactory.mixpanel(), 'track');

  beforeEach(() => {
    apiClient = new FakeBoclipsClient();

    apiClient.videos.setRecommendationsForVideo(mainId, [
      VideoFactory.sample({ title: recTitle }),
    ]);
    mixpanelTrack.mockClear();
  });

  it('sends a mixpanel event on add to cart', async () => {
    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={apiClient}>
          <VideoRecommendations video={VideoFactory.sample({ id: mainId })} />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    const addToCartButton = await wrapper.findByTestId('add-to-cart-button');

    fireEvent.click(addToCartButton);

    await waitFor(() =>
      expect(mixpanelTrack).toHaveBeenCalledWith(
        'video_recommendation_cart_add',
      ),
    );
  });

  it('sends a mixpanel event on add to playlist', async () => {
    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={apiClient}>
          <VideoRecommendations video={VideoFactory.sample({ id: mainId })} />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    const addToPlaylistButton = await wrapper.findByLabelText(
      'Add to playlist',
    );

    fireEvent.click(addToPlaylistButton);

    await waitFor(() =>
      expect(mixpanelTrack).toHaveBeenCalledWith(
        'video_recommendation_playlist_add',
      ),
    );
  });

  it('sends a mixpanel event on url copied', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={apiClient}>
          <VideoRecommendations video={VideoFactory.sample({ id: mainId })} />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    await waitFor(() => wrapper.getByTestId('copy-button-true'));

    fireEvent.click(wrapper.getByTestId('copy-button-true'));

    await waitFor(() => expect(mixpanelTrack).toHaveBeenCalled());

    expect(mixpanelTrack).toHaveBeenCalledWith(
      'video_recommendation_url_copied',
    );
  });

  it('senda a mixpanel event on recommendation clicked', async () => {
    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={apiClient}>
          <VideoRecommendations video={VideoFactory.sample({ id: mainId })} />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    const recommendationLink = await wrapper.findByLabelText(
      `${recTitle} grid card`,
    );

    fireEvent.click(recommendationLink);

    await waitFor(() =>
      expect(mixpanelTrack).toHaveBeenCalledWith(
        'video_recommendation_clicked',
      ),
    );
  });
});
