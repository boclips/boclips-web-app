export default class MixpanelService {
  private readonly mixpanel: Mixpanel | null;

  public constructor(mixpanel?: Mixpanel) {
    this.mixpanel = mixpanel;
  }

  public track(eventName: string) {
    this.mixpanel?.track(eventName);
  }
}
