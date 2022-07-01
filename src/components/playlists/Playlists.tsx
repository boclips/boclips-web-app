import React from 'react';
import { useOwnAndSharedPlaylistsQuery } from 'src/hooks/api/playlistsQuery';
import SkeletonTiles from 'src/components/skeleton/Skeleton';
import Thumbnails from 'src/components/playlists/thumbnails/Thumbnails';
import { CopyButton } from 'src/components/common/copyLinkButton/CopyButton';
import { Constants } from 'src/AppConstants';
import { Link } from 'react-router-dom';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import GridCard from '../common/gridCard/GridCard';
import s from './style.module.less';

const Playlists = () => {
  const linkCopiedHotjarEvent = () =>
    AnalyticsFactory.hotjar().event(HotjarEvents.PlaylistLinkCopied);

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
            header={
              <Link tabIndex={-1} to={`/playlists/${playlist.id}`}>
                <Thumbnails videos={playlist.videos} />
              </Link>
            }
            footer={
              <div className="w-fit	self-end p-1">
                <CopyButton
                  ariaLabel="Copy playlist link"
                  textToCopy={`${Constants.HOST}/playlists/${playlist.id}`}
                  dataQa={`share-playlist-button-${playlist.id}`}
                  onCopy={linkCopiedHotjarEvent}
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
