import Hotjar from 'src/services/hotjar/Hotjar';
import VideoAddedToPlaylist from 'src/services/hotjar/events/VideoAddedToPlaylist';
import VideoRemovedFromPlaylist from 'src/services/hotjar/events/VideoRemovedFromPlaylist';
import VideoRemovedFromCart from 'src/services/hotjar/events/VideoRemovedFromCart';
import { VideoAddedToCart } from 'src/services/hotjar/events/VideoAddedToCart';
import BaseEvent from 'src/services/hotjar/events/BaseEvent';

const userAttributes = {
  organisationId: 'organisation_id',
  organisationName: 'organisation_name',
  videoIdAddedToCart: 'video_id_added_to_cart',
  videoIdRemovedFromCart: 'video_id_removed_from_cart',
  playlistIdVideoWasAddedTo: 'playlist_id_video_was_added_to',
  playlistIdVideoWasRemovedFrom: 'playlist_id_video_was_removed_from',
  videoIdAddedToPlaylist: 'video_id_added_to_playlist',
  videoIdRemovedFromPlaylist: 'video_id_removed_from_playlist',
};

export default class HotjarService {
  private readonly hotjar: Hotjar;

  public constructor(hotjar: Hotjar) {
    this.hotjar = hotjar;
  }

  public videoAddedToCart(event: VideoAddedToCart) {
    const payload = HotjarService.organisation(event);

    payload[userAttributes.videoIdAddedToCart] = event.videoId;

    this.hotjar.sendIdentity(event.userId, payload);
  }

  public videoRemovedFromCart(event: VideoRemovedFromCart) {
    const payload = HotjarService.organisation(event);

    payload[userAttributes.videoIdRemovedFromCart] = event.videoId;

    this.hotjar.sendIdentity(event.userId, payload);
  }

  public videoAddedToPlaylist(event: VideoAddedToPlaylist) {
    const payload = HotjarService.organisation(event);

    payload[userAttributes.playlistIdVideoWasAddedTo] = event.playlistId;
    payload[userAttributes.videoIdAddedToPlaylist] = event.videoId;

    this.hotjar.sendIdentity(event.userId, payload);
  }

  public videoRemovedFromPlaylist(event: VideoRemovedFromPlaylist) {
    const payload = HotjarService.organisation(event);

    payload[userAttributes.playlistIdVideoWasRemovedFrom] = event.playlistId;
    payload[userAttributes.videoIdRemovedFromPlaylist] = event.videoId;

    this.hotjar.sendIdentity(event.userId, payload);
  }

  private static organisation(event: BaseEvent): object {
    const org = {};

    org[userAttributes.organisationId] = event.organisationId;
    org[userAttributes.organisationName] = event.organisationName;

    return org;
  }
}
