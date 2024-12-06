import { BoclipsClient } from 'boclips-api-client';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { Constants } from '@src/AppConstants';
import { ViewType } from '@components/searchResults/ViewButtons';
import { SearchQueryCompletionsSuggestedRequest } from 'boclips-api-client/dist/sub-clients/events/model/SearchQueryCompletionsSuggestedRequest';

export const trackPageRendered = (location, apiClient) => {
  return apiClient.events.trackPageRendered({
    url: `${Constants.HOST}${location.pathname}${location.search}`,
  });
};

export const trackSearchCompletionsSuggested = (
  event: SearchQueryCompletionsSuggestedRequest,
  apiClient,
) => {
  return apiClient.events.trackSearchQueryCompletionsSuggested(event);
};

export const trackCopyVideoShareLink = (
  video: Video,
  apiClient: BoclipsClient,
) => {
  apiClient.events.trackVideoInteraction(video, 'VIDEO_LINK_COPIED');
};

export const trackVideoAddedToCart = (
  video: Video,
  apiClient: BoclipsClient,
) => {
  if (video.links.logInteraction) {
    apiClient.events.trackVideoInteraction(video, 'VIDEO_ADDED_TO_CART');
  }
};

export const trackVideoRemovedFromCart = (
  video: Video,
  apiClient: BoclipsClient,
) => {
  if (video.links.logInteraction) {
    apiClient.events.trackVideoInteraction(video, 'VIDEO_REMOVED_FROM_CART');
  }
};

export const trackViewTypeChangedTo = (
  viewType: ViewType,
  apiClient: BoclipsClient,
) => {
  apiClient.events.trackPlatformInteraction(
    `SEARCH_VIEW_CHANGED_TO_${viewType}`,
    false,
  );
};

export const trackNavigateToVideoDetails = (
  video: Video,
  apiClient: BoclipsClient,
) => {
  apiClient.events.trackVideoInteraction(video, 'NAVIGATE_TO_VIDEO_DETAILS');
};

export const trackOrderConfirmationModalOpened = (apiClient: BoclipsClient) => {
  apiClient.events.trackPlatformInteraction(
    'ORDER_CONFIRMATION_MODAL_OPENED',
    false,
  );
};

export const trackOrderConfirmed = (apiClient: BoclipsClient) => {
  apiClient.events.trackPlatformInteraction('ORDER_CONFIRMED', false);
};
