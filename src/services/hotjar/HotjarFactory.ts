import HotjarService from 'src/services/hotjar/HotjarService';
import Hotjar from 'src/services/hotjar/Hotjar';

const hotjar = new Hotjar(window.hj);
const hotjarService = new HotjarService(hotjar);

export default class HotjarFactory {
  public static hotjar(): HotjarService {
    return hotjarService;
  }
}
