import Hotjar from 'src/services/hotjar/Hotjar';
import HotjarService from 'src/services/hotjar/HotjarService';
import { VideoAddedToCart } from 'src/services/hotjar/events/VideoAddedToCart';
import VideoRemovedFromCart from 'src/services/hotjar/events/VideoRemovedFromCart';
import VideoAddedToPlaylist from 'src/services/hotjar/events/VideoAddedToPlaylist';

describe('HotjarService', () => {
  let hotjar: Hotjar;
  let hotjarService;

  const user = {
    id: 'user-100',
    firstName: 'Jack',
    lastName: 'Sparrow',
    email: 'jack.sparrow@boclips.com',
    organisation: {
      id: 'org-200',
      name: 'Super org',
    },
  };

  beforeEach(() => {
    hotjar = new Hotjar();
    jest.spyOn(hotjar, 'identify');

    hotjarService = new HotjarService(hotjar);
  });

  it('sends no organisation if empty', () => {
    const userWithoutOrg = {
      id: 'user-100',
      firstName: 'Jack',
      lastName: 'Sparrow',
      email: 'jack.sparrow@boclips.com',
      organisation: null,
    };
    const event = new VideoAddedToCart(userWithoutOrg, 'video-888');

    hotjarService.videoAddedToCart(event);

    expect(hotjar.identify).toHaveBeenCalledWith(user.id, {
      organisation_id: undefined,
      organisation_name: undefined,
      video_id_added_to_cart: event.videoId,
    });
  });

  it('sends video added to cart event', () => {
    const event = new VideoAddedToCart(user, 'video-11');

    hotjarService.videoAddedToCart(event);

    expect(hotjar.identify).toHaveBeenCalledWith(user.id, {
      organisation_id: user.organisation.id,
      organisation_name: user.organisation.name,
      video_id_added_to_cart: event.videoId,
    });
  });

  it('sends video removed from cart event', () => {
    const event = new VideoRemovedFromCart(user, 'video-009');

    hotjarService.videoRemovedFromCart(event);

    expect(hotjar.identify).toHaveBeenCalledWith(user.id, {
      organisation_id: user.organisation.id,
      organisation_name: user.organisation.name,
      video_id_removed_from_cart: event.videoId,
    });
  });

  it('sends video added to playlist event', () => {
    const event = new VideoAddedToPlaylist(user, 'playlist-665', 'video-777');

    hotjarService.videoAddedToPlaylist(event);

    expect(hotjar.identify).toHaveBeenCalledWith(user.id, {
      organisation_id: user.organisation.id,
      organisation_name: user.organisation.name,
      playlist_id_video_was_added_to: event.playlistId,
      video_id_added_to_playlist: event.videoId,
    });
  });

  it('sends video removed from playlist event', () => {
    const event = new VideoAddedToPlaylist(user, 'playlist-665', 'video-777');

    hotjarService.videoRemovedFromPlaylist(event);

    expect(hotjar.identify).toHaveBeenCalledWith(user.id, {
      organisation_id: user.organisation.id,
      organisation_name: user.organisation.name,
      playlist_id_video_was_removed_from: event.playlistId,
      video_id_removed_from_playlist: event.videoId,
    });
  });
});
