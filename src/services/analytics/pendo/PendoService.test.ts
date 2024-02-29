import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { PendoService } from 'src/services/analytics/pendo/PendoService';
import { AccountType } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe('Pendo Service', () => {
  it('passes essential user data to pendo', () => {
    const user = UserFactory.sample({
      id: 'user-id',
      email: 'user@monday.com',
      firstName: 'M',
      lastName: 'J',
      jobTitle: 'barista',
      audiences: ['caffeine addicts'],
      desiredContent: 'books&coffee',
      account: {
        id: 'account-id',
        name: 'account name',
        marketingInformation: {
          companySegments: ['Publisher'],
        },
        type: AccountType.STANDARD,
      },
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
        role: 'barista',
        content: 'books&coffee',
        audiences: ['caffeine addicts'],
      },
      account: {
        id: 'account-id',
        name: 'account name',
        type: ['Publisher'],
      },
    });
  });

  it('uses n/a when there is no account id defined', () => {
    let user = UserFactory.sample({
      id: 'user-id',
      email: 'user@monday.com',
      firstName: 'M',
      lastName: 'J',
      jobTitle: undefined,
      audiences: undefined,
      desiredContent: undefined,
    });
    user = { ...user, account: null };

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
        role: '',
        content: '',
        audiences: [],
      },
      account: {
        id: 'n/a',
        name: 'n/a',
        type: [],
      },
    });
  });
});
