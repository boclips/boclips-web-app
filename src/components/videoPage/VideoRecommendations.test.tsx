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
  it('sends a mixpanel event on add to cart', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.videos.setRecommendationsForVideo('sample id', [
      VideoFactory.sample({}),
    ]);

    const mixpanelEventAddedToCart = jest.spyOn(
      AnalyticsFactory.mixpanel(),
      'track',
    );

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={apiClient}>
          <VideoRecommendations
            video={VideoFactory.sample({ id: 'sample id' })}
          />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    const addToCartButton = await wrapper.findByTestId('add-to-cart-button');

    fireEvent.click(addToCartButton);

    await waitFor(() =>
      expect(mixpanelEventAddedToCart).toHaveBeenCalledWith(
        'video_recommendation_cart_add',
      ),
    );
  });

  it('sends a mixpanel event on add to playlist', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.videos.setRecommendationsForVideo('sample id', [
      VideoFactory.sample({}),
    ]);

    const mixpanelEventAddedToPlaylist = jest.spyOn(
      AnalyticsFactory.mixpanel(),
      'track',
    );

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={apiClient}>
          <VideoRecommendations
            video={VideoFactory.sample({ id: 'sample id' })}
          />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    const addToPlaylistButton = await wrapper.findByLabelText(
      'Add to playlist',
    );

    fireEvent.click(addToPlaylistButton);

    await waitFor(() =>
      expect(mixpanelEventAddedToPlaylist).toHaveBeenCalledWith(
        'video_recommendation_playlist_add',
      ),
    );
  });

  it('sends a mixpanel event on url copied', async () => {
    // TODO (Armin): extract this to fixture
    const apiClient = new FakeBoclipsClient();
    apiClient.videos.setRecommendationsForVideo('sample id', [
      VideoFactory.sample({}),
    ]);

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });

    const mixpanelEventUrlCopied = jest.spyOn(
      AnalyticsFactory.mixpanel(),
      'track',
    );

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={apiClient}>
          <VideoRecommendations
            video={VideoFactory.sample({ id: 'sample id' })}
          />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    const urlCopyButton = await wrapper.findByLabelText('Copy video link');

    fireEvent.click(urlCopyButton);

    await waitFor(() =>
      expect(mixpanelEventUrlCopied).toHaveBeenCalledWith(
        'video_recommendation_url_copied',
      ),
    );
  });

  it('senda a mixpanel event on recommendation clicked', async () => {
    const recTitle = 'How to install a kitchen sink in Emacs?';
    const apiClient = new FakeBoclipsClient();
    apiClient.videos.setRecommendationsForVideo('sample id', [
      VideoFactory.sample({ title: recTitle }),
    ]);

    const mixpanelEventRecommendationClicked = jest.spyOn(
      AnalyticsFactory.mixpanel(),
      'track',
    );

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={apiClient}>
          <VideoRecommendations
            video={VideoFactory.sample({ id: 'sample id' })}
          />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    const recommendationLink = await wrapper.findByLabelText(
      `${recTitle} grid card`,
    );

    fireEvent.click(recommendationLink);

    await waitFor(() =>
      expect(mixpanelEventRecommendationClicked).toHaveBeenCalledWith(
        'video_recommendation_clicked',
      ),
    );
  });
});
