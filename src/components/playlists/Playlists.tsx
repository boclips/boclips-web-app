import React from 'react';
import { useOwnAndSharedPlaylistsQuery } from 'src/hooks/api/playlistsQuery';
import SkeletonTiles from 'src/components/skeleton/Skeleton';
import Thumbnails from 'src/components/playlists/thumbnails/Thumbnails';
import { CopyLinkButton } from 'src/components/common/copyLinkButton/CopyLinkButton';
import { Constants } from 'src/AppConstants';
import GridCard from '../common/gridCard/GridCard';
import s from './style.module.less';

const Playlists = () => {
  const { data: playlists, isLoading } = useOwnAndSharedPlaylistsQuery();

  return (
    <main tabIndex={-1} className={s.playlistsWrapper}>
      {isLoading ? (
        <SkeletonTiles className={s.skeletonCard} />
      ) : (
        playlists?.map((playlist) => (
          <GridCard
            key={playlist.id}
            link={`/playlists/${playlist.id}`}
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
                  link={`${Constants.HOST}/playlists/${playlist.id}`}
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
