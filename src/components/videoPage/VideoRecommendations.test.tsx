import { waitFor } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import React from 'react';
import VideoRecommendations from '@components/videoPage/VideoRecommendations';
import AnalyticsFactory from '@src/services/analytics/AnalyticsFactory';
import { render } from '@src/testSupport/render';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import { HotjarEvents } from '@src/services/analytics/hotjar/Events';
import { BoclipsClientProvider } from '../common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from '../common/providers/BoclipsSecurityProvider';
import userEvent from "@testing-library/user-event";

describe('video recommendations', () => {
  let apiClient: FakeBoclipsClient;
  const mainId = 'main id';
  const recTitle = 'How to install a kitchen sink in Emacs?';
  const hotjarEvent = vi.spyOn(AnalyticsFactory.hotjar(), 'event');

  beforeEach(() => {
    apiClient = new FakeBoclipsClient();

    apiClient.videos.setRecommendationsForVideo(mainId, [
      VideoFactory.sample({ title: recTitle }),
    ]);
    hotjarEvent.mockClear();
  });

  it('sends a hotjar event on add to cart', async () => {
    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={apiClient}>
          <VideoRecommendations video={VideoFactory.sample({ id: mainId })} />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    const addToCartButton = await wrapper.findByTestId('add-to-cart-button');

    await userEvent.click(addToCartButton);

    await waitFor(() =>
      expect(hotjarEvent).toHaveBeenCalledWith(
        HotjarEvents.AddToCartFromRecommendedVideos,
      ),
    );
  });
});
