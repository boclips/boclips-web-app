import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { PendoService } from 'src/services/analytics/pendo/PendoService';

describe('Pendo Service', () => {
  it('passes essential user data to pendo', () => {
    const user = UserFactory.sample({
      id: 'user-id',
      email: 'user@monday.com',
      firstName: 'M',
      lastName: 'J',
      accountId: 'account-id',
    });

    const initializeSpy = jest.fn();
    const service = new PendoService({
      ...window.pendo,
      initialize: initializeSpy,
    });

    service.identify(user);

    expect(initializeSpy).lastCalledWith({
      visitor: {
        id: 'user-id',
        email: 'user@monday.com',
        full_name: 'M J',
      },
      account: {
        id: 'account-id',
      },
    });
  });
  it('uses n/a when there is no account id defined', () => {
    const user = UserFactory.sample({
      id: 'user-id',
      email: 'user@monday.com',
      firstName: 'M',
      lastName: 'J',
      accountId: undefined,
    });

    const initializeSpy = jest.fn();
    const service = new PendoService({
      ...window.pendo,
      initialize: initializeSpy,
    });

    service.identify(user);

    expect(initializeSpy).lastCalledWith({
      visitor: {
        id: 'user-id',
        email: 'user@monday.com',
        full_name: 'M J',
      },
      account: {
        id: 'n/a',
      },
    });
  });
});
