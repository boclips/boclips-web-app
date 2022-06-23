import { AppConstants } from './AppConstants';

describe('AppConstants', () => {
  it('obtain host', () => {
    const appConfig = new AppConstants({
      location: {
        hostname: 'something.com',
        protocol: 'https:',
        port: '123',
      },
    } as Window);

    const host = appConfig.HOST;

    expect(host).toBe('https://something.com:123');
  });

  it('returns null when mixpanel token is not specified', () => {
    const appConfig = new AppConstants({ Environment: {} } as Window);
    const token = appConfig.MIXPANEL_TOKEN;

    expect(token).toBeNull();
  });

  it('returns a specified mixpanel token', () => {
    const mixpanelToken = 'mixpanel-123';
    const appConfig = new AppConstants({
      Environment: {
        MIXPANEL_TOKEN: mixpanelToken,
      },
    } as Window);
    const token = appConfig.MIXPANEL_TOKEN;

    expect(token).toEqual(mixpanelToken);
  });
});
