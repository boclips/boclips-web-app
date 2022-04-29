import { AnalyticsService } from 'src/services/analytics/appcues/AnalyticsService';
import HotjarService from 'src/services/analytics/hotjar/HotjarService';
import Hotjar from 'src/services/analytics/hotjar/Hotjar';

export default class AnalyticsFactory {
  private static appcuesService: AnalyticsService;

  private static hotjarService: HotjarService;

  public static appcues(): AnalyticsService {
    if (!this.appcuesService) {
      this.appcuesService = new AnalyticsService(window.Appcues);
    }
    return this.appcuesService;
  }

  public static hotjar(): HotjarService {
    if (!this.hotjarService) {
      const hotjar = new Hotjar(window.hj);
      this.hotjarService = new HotjarService(hotjar);
    }
    return this.hotjarService;
  }
}
