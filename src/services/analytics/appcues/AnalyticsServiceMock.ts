import { AnalyticsService } from 'src/services/analytics/appcues/AnalyticsService';

export const analyticsMock = {
  sendEvent: jest.fn(),
  identify: jest.fn(),
  pageChanged: jest.fn(),
} as AnalyticsService;
