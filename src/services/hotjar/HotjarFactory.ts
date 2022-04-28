import HotjarService from 'src/services/hotjar/HotjarService';
import Hotjar from 'src/services/hotjar/Hotjar';

export default class HotjarFactory {
  private static hotjarService: HotjarService;

  public static hotjar(): HotjarService {
    if (!HotjarFactory.hotjarService) {
      HotjarFactory.hotjarService = new HotjarService(new Hotjar(window.hj));
    }

    return HotjarFactory.hotjarService;
  }
}
