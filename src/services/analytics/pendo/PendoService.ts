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

  public identify(userId: string, accountId: string) {
    if (this.pendoInstance) {
      this.pendoInstance.identify({
        visitor: {
          id: userId,
        },
        account: {
          id: accountId || 'n/a',
        },
      });
    }
  }
}
