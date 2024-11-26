import { Constants } from '@src/AppConstants';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import AnalyticsFactory from '@src/services/analytics/AnalyticsFactory';
import { HotjarEvents } from '@src/services/analytics/hotjar/Events';
import { displayNotification } from '@components/common/notification/displayNotification';

const linkCopiedHotjarEvent = () =>
  AnalyticsFactory.hotjar().event(HotjarEvents.PlaylistShareableLinkCopied);

const buildPlaylistLink = (playlist: Collection): string => {
  return `${Constants.HOST}/playlists/${playlist.id}`;
};

export const copySharePlaylistLink = (playlist: Collection) => {
  navigator.clipboard.writeText(buildPlaylistLink(playlist)).then(() => {
    displayNotification(
      'success',
      'Link copied!',
      'You can now share this playlist using the copied link',
      'playlist-link-copied-notification',
    );

    linkCopiedHotjarEvent();
  });
};
