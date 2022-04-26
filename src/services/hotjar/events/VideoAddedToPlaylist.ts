import BaseEvent from 'src/services/hotjar/events/BaseEvent';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';

export default class VideoAddedToPlaylist extends BaseEvent {
  public readonly playlistId: string;

  public readonly videoId: string;

  constructor(user: User, playlistId: string, videoId: string) {
    super(user);

    this.playlistId = playlistId;
    this.videoId = videoId;
  }
}
