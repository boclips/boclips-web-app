import BaseEvent from 'src/services/hotjar/events/BaseEvent';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';

export default class VideoRemovedFromCart extends BaseEvent {
  public readonly videoId: string;

  constructor(user: User, videoId: string) {
    super(user);

    this.videoId = videoId;
  }
}
