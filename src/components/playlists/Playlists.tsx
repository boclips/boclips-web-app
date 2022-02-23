import React from 'react';
import { useOwnAndSharedPlaylistsQuery } from 'src/hooks/api/playlistsQuery';
import SkeletonTiles from 'src/components/skeleton/Skeleton';
import Thumbnails from 'src/components/playlists/playlistCard/Thumbnails';
import { CopyLinkButton } from 'src/components/common/copyLinkButton/CopyLinkButton';
import { Constants } from 'src/AppConstants';
import PlaylistCard from './playlistCard/PlaylistCard';
import s from './style.module.less';

const Playlists = () => {
  const { data: playlists, isLoading } = useOwnAndSharedPlaylistsQuery();

  return (
    <main className={s.playlistsWrapper}>
      {isLoading ? (
        <SkeletonTiles className={s.playlistCard} />
      ) : (
        playlists?.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            link={`/library/${playlist.id}`}
            name={playlist.title}
            overlay={
              playlist.mine === false && (
                <div className={s.sharedWithYouOverlay}>Shared with you</div>
              )
            }
            header={<Thumbnails videos={playlist.videos} />}
            footer={
              <div className="w-fit	self-end p-1">
                <CopyLinkButton
                  ariaLabel="Copy playlist link"
                  link={`${Constants.HOST}/library/${playlist.id}`}
                  dataQa={`share-playlist-button-${playlist.id}`}
                />
              </div>
            }
          />
        ))
      )}
    </main>
  );
};

export default Playlists;
