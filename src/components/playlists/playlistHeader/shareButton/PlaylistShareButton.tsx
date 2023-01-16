import React from 'react';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { Constants } from 'src/AppConstants';
import { CollectionPermission } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionPermissions';
import { OwnOrEditablePlaylistShareButton } from 'src/components/playlists/playlistHeader/shareButton/OwnOrEditablePlaylistShareButton';
import { ViewOnlyPlaylistShareButton } from 'src/components/playlists/playlistHeader/shareButton/ViewOnlyPlaylistShareButton';

interface Props {
  playlist: Collection;
}

export const PlaylistShareButton = ({ playlist }: Props) => {
  const link = `${Constants.HOST}/playlists/${playlist.id}`;

  const isEditable: boolean =
    playlist.mine || playlist.permissions.anyone === CollectionPermission.EDIT;

  const linkCopiedHotjarEvent = () =>
    AnalyticsFactory.hotjar().event(HotjarEvents.PlaylistShareableLinkCopied);

  const handleClick = () => {
    navigator.clipboard.writeText(link).then(() => {
      displayNotification(
        'success',
        'Link copied!',
        'You can now share this playlist using the copied link',
        'playlist-link-copied-notification',
      );

      linkCopiedHotjarEvent();
    });
  };

  return (
    <>
      {isEditable ? (
        <OwnOrEditablePlaylistShareButton
          playlist={playlist}
          handleClick={handleClick}
        />
      ) : (
        <ViewOnlyPlaylistShareButton handleClick={handleClick} />
      )}
    </>
  );
};
