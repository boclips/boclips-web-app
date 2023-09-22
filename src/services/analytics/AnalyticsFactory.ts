import HotjarService from 'src/services/analytics/hotjar/HotjarService';
import Hotjar from 'src/services/analytics/hotjar/Hotjar';
import mixpanel from 'mixpanel-browser';
import { Constants } from 'src/AppConstants';
import { PendoService } from 'src/services/analytics/pendo/PendoService';
import MixpanelService from './mixpanel/MixpanelService';

export default class AnalyticsFactory {
  private static pendoService: PendoService;

  private static hotjarService: HotjarService;

  private static mixpanelService: MixpanelService;

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

  public static mixpanel(): MixpanelService {
    if (!this.mixpanelService) {
      const mixpanelToken = Constants.MIXPANEL_TOKEN;
      if (mixpanelToken !== null) {
        mixpanel.init(mixpanelToken, { debug: false });
        this.mixpanelService = new MixpanelService(mixpanel);
      } else {
        this.mixpanelService = new MixpanelService(null);
      }
    }
    return this.mixpanelService;
  }
}
