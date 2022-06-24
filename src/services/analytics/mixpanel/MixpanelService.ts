type MixpanelEvent =
  | 'video_recommendation_played'
  | 'video_recommendation_url_copied'
  | 'video_recommendation_legacy_url_copied'
  | 'video_recommendation_playlist_add'
  | 'video_details_played'
  | 'video_details_url_copied'
  | 'video_details_legacy_url_copied'
  | 'video_details_playlist_add';

export default class MixpanelService {
  private readonly mixpanel: Mixpanel | null;

  public constructor(mixpanel?: Mixpanel) {
    this.mixpanel = mixpanel;
  }

  public track(
    eventName: MixpanelEvent,
    properties?: { [index: string]: any },
  ): void {
    this.mixpanel?.track(eventName, properties);
  }
}
