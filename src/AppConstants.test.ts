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
});
