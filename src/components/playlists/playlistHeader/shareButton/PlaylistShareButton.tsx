import React from 'react';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { CollectionPermission } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionPermissions';
import { OwnOrEditablePlaylistShareButton } from 'src/components/playlists/playlistHeader/shareButton/OwnOrEditablePlaylistShareButton';
import { ViewOnlyPlaylistShareButton } from 'src/components/playlists/playlistHeader/shareButton/ViewOnlyPlaylistShareButton';
import { copySharePlaylistLink } from 'src/services/copySharePlaylistLink';

interface Props {
  playlist: Collection;
}

export const PlaylistShareButton = ({ playlist }: Props) => {
  const isEditable: boolean =
    playlist.mine || playlist.permissions.anyone === CollectionPermission.EDIT;

  return (
    <>
      {isEditable ? (
        <OwnOrEditablePlaylistShareButton
          playlist={playlist}
          handleClick={() => copySharePlaylistLink(playlist)}
        />
      ) : (
        <ViewOnlyPlaylistShareButton
          handleClick={() => copySharePlaylistLink(playlist)}
        />
      )}
    </>
  );
};
