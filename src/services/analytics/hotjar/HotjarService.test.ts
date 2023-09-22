import Hotjar from 'src/services/analytics/hotjar/Hotjar';
import HotjarService from 'src/services/analytics/hotjar/HotjarService';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import UserAttributes from 'src/services/analytics/hotjar/UserAttributes';

describe('HotjarService', () => {
  let hotjar: Hotjar;
  let hotjarService;

  beforeEach(() => {
    hotjar = new Hotjar();
    jest.spyOn(hotjar, 'event');
    jest.spyOn(hotjar, 'identify');

    hotjarService = new HotjarService(hotjar);
  });

  it('sends event as a string', () => {
    hotjarService.event(HotjarEvents.VideoAddedToCart);

    expect(hotjar.event).toHaveBeenCalledWith(
      HotjarEvents.VideoAddedToCart.toString(),
      undefined,
    );
  });

  it('user id is not sent with user attributes', () => {
    const user = {
      id: 'user-998',
      firstName: 'Jack',
      lastName: 'Sparrow',
      email: 'jack@voclips.com',
      organisation: undefined,
    };
    const attributes = new UserAttributes(user);

    hotjarService.userAttributes(attributes);

    expect(hotjar.identify).toHaveBeenCalledWith(null, {
      organisation_id: null,
      organisation_name: null,
    });
  });

  it('sends user organisation as user attributes', () => {
    const user = {
      id: 'user-998',
      firstName: 'Jack',
      lastName: 'Sparrow',
      email: 'jack@voclips.com',
      organisation: {
        id: 'org-09',
        name: 'Org 09',
      },
    };
    const attributes = new UserAttributes(user);

    hotjarService.userAttributes(attributes);

    expect(hotjar.identify).toHaveBeenCalledWith(null, {
      organisation_id: user.organisation.id,
      organisation_name: user.organisation.name,
    });
  });
});
