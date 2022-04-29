import Appcues from 'src/services/analytics/appcues/Appcues';
import { AnalyticsUserProfile } from 'src/services/analytics/appcues/AnalyticsUserProfile';
import { AppcuesEvent } from 'src/types/AppcuesEvent';

export class AnalyticsService {
  private readonly appcuesInstance?: Appcues;

  public constructor(appcues?: Appcues) {
    if (!appcues) {
      console.error('Appcues is not defined');
    } else {
      this.appcuesInstance = appcues;
    }
  }

  public identify(userProfile: AnalyticsUserProfile) {
    if (this.appcuesInstance) {
      this.appcuesInstance.identify(userProfile.id, {
        name: userProfile.firstName,
        email: userProfile.email,
      });
    }
  }

  public pageChanged() {
    if (this.appcuesInstance) {
      this.appcuesInstance.page();
    }
  }

  public sendEvent(type: AppcuesEvent, payload: Record<string, any> = {}) {
    if (this.appcuesInstance) {
      this.appcuesInstance.track(type.toString(), payload);
    }
  }
}
