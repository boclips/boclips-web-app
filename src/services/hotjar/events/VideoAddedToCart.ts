import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import BaseEvent from 'src/services/hotjar/events/BaseEvent';

export class VideoAddedToCart extends BaseEvent {
  public readonly videoId: string;

  constructor(user: User, videoId: string) {
    super(user);

    this.videoId = videoId;
  }
}
