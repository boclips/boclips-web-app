import React from 'react';
import { PlaylistShareButton } from 'src/components/playlists/PlaylistShareButton';
import { Constants } from 'src/AppConstants';

interface Props {
  title: string;
  playlistId: string;
}

const PlaylistHeader = ({ title, playlistId }: Props) => {
  const toLink = (id) => {
    return `${Constants.HOST}/library/${id}`;
  };

  return (
    <>
      <h2
        data-qa="playlistTitle"
        className="grid-row-start-2 grid-row-end-2 col-start-2 col-end-26"
      >
        {title}
      </h2>
      <PlaylistShareButton
        title="Get shareable link"
        link={toLink(playlistId)}
      />
    </>
  );
};

export default PlaylistHeader;
