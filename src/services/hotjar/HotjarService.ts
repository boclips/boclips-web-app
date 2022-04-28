import Hotjar from 'src/services/hotjar/Hotjar';
import { HotjarEvents } from 'src/services/hotjar/Events';
import UserAttributes from 'src/services/hotjar/UserAttributes';

export default class HotjarService {
  private readonly hotjar: Hotjar;

  public constructor(hotjar: Hotjar) {
    this.hotjar = hotjar;
  }

  public event(event: HotjarEvents) {
    this.hotjar.event(event);

    console.log('Hotjar event sent: ' + event);
  }

  public userAttributes(user: UserAttributes) {
    this.hotjar.identify(user.userId(), user.attributes());

    console.log(user.attributes());
  }
}
