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
  it('sends a mixpanel addToCart event', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.videos.setRecommendationsForVideo("sample id", [VideoFactory.sample({})])

    const mixpanelEventAddedToCart = jest.spyOn(
      AnalyticsFactory.mixpanel(),
      'track',
    );

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={apiClient}>
          <VideoRecommendations video={VideoFactory.sample({id: "sample id"})} />
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
});
