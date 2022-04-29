import { AnalyticsService } from 'src/services/analytics/appcues/AnalyticsService';
import Appcues from 'src/services/analytics/appcues/Appcues';
import { AnalyticsUserProfile } from 'src/services/analytics/appcues/AnalyticsUserProfile';
import { AppcuesEvent } from 'src/types/AppcuesEvent';

describe('AnalyticsService', () => {
  let mockAppcues: Appcues;
  let analyticsService;

  beforeEach(() => {
    mockAppcues = {
      track: jest.fn(),
      page: jest.fn(),
      identify: jest.fn(),
    };
    analyticsService = new AnalyticsService(mockAppcues);
  });

  it('sets a user id', () => {
    const userProfile: AnalyticsUserProfile = {
      id: 'testId',
      firstName: 'test first name',
      email: 'test@test.com',
    };
    analyticsService.identify(userProfile);

    expect(mockAppcues.identify).toHaveBeenCalledWith('testId', {
      name: 'test first name',
      email: 'test@test.com',
    });
  });

  it('sends a page rendered event', () => {
    analyticsService.sendEvent(AppcuesEvent.CART_OPENED);

    expect(mockAppcues.track).toHaveBeenCalledWith('CART_OPENED', {});
  });

  it('sends a page changed event', () => {
    analyticsService.pageChanged();

    expect(mockAppcues.page).toHaveBeenCalled();
  });
});
