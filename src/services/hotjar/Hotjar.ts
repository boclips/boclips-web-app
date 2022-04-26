export default class Hotjar {
  private static readonly default: (
    api: string,
    id?: string,
    payload?: object,
  ) => void = () => {};

  private readonly hj: (api: string, id?: string, payload?: object) => void;

  public constructor(
    hj?: (api: string, id?: string, payload?: object) => void,
  ) {
    if (hj) {
      this.hj = hj;
    } else {
      console.warn('Hotjar is not defined. Setting up empty Hotjar func');
      this.hj = Hotjar.default;
    }
  }

  public sendEvent(event: string) {
    this.hj('event', event);
  }

  public sendIdentity(id: string, payload: object) {
    this.hj('identity', id, payload);
  }
}
