import { AnalyticsService } from 'src/services/analytics/appcues/AnalyticsService';
import HotjarService from 'src/services/analytics/hotjar/HotjarService';
import Hotjar from 'src/services/analytics/hotjar/Hotjar';
import mixpanel from 'mixpanel-browser';
import { Constants } from 'src/AppConstants';
import BucketService from 'src/services/analytics/bucket/BucketService';
import bucket from '@bucketco/tracking-sdk';
import MixpanelService from './mixpanel/MixpanelService';

export default class AnalyticsFactory {
  private static appcuesService: AnalyticsService;

  private static hotjarService: HotjarService;

  private static mixpanelService: MixpanelService;

  private static bucketService: BucketService;

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

  public static bucket(): BucketService {
    if (!this.bucketService) {
      const bucketToken = Constants.BUCKET_TOKEN;
      if (bucketToken !== null) {
        bucket.init(bucketToken, {});
        this.bucketService = new BucketService(bucket);
      } else {
        this.bucketService = new BucketService(null);
      }
    }
    return this.bucketService;
  }
}
