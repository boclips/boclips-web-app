import HotjarService from '@src/services/analytics/hotjar/HotjarService';
import Hotjar from '@src/services/analytics/hotjar/Hotjar';
import { PendoService } from '@src/services/analytics/pendo/PendoService';

export default class AnalyticsFactory {
  private static pendoService: PendoService;

  private static hotjarService: HotjarService;

  public static pendo(): PendoService {
    if (!this.pendoService) {
      this.pendoService = new PendoService(window.pendo);
    }
    return this.pendoService;
  }

  public static hotjar(): HotjarService {
    if (!this.hotjarService) {
      const hotjar = new Hotjar(window.hj);
      this.hotjarService = new HotjarService(hotjar);
    }
    return this.hotjarService;
  }
}
