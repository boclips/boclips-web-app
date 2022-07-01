import { Constants } from 'src/AppConstants';

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
      if (Constants.IS_HOTJAR_ENABLED) {
        console.warn('Hotjar is not defined. Setting up empty Hotjar func');
      }

      this.hj = Hotjar.default;
    }
  }

  public event(event: string) {
    this.hj('event', event);
  }

  public identify(id: string, payload: object) {
    this.hj('identify', id, payload);
  }
}
