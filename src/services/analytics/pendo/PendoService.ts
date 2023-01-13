import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import Pendo = pendo.Pendo;

export class PendoService {
  private readonly pendoInstance?: Pendo;

  public constructor(pendo?: Pendo) {
    if (!pendo) {
      console.error('Pendo is not defined');
    } else {
      this.pendoInstance = pendo;
    }
  }

  public identify(user: User) {
    if (this.pendoInstance) {
      this.pendoInstance.initialize({
        visitor: {
          id: user.id,
          email: user.email,
          full_name: `${user.firstName} ${user.lastName}`,
        },
        account: {
          id: user.account?.id || 'n/a',
          name: user.account?.name || 'n/a',
        },
      });
    }
  }
}
