import React from 'react';
import { ListViewCollection } from 'boclips-api-client/dist/sub-clients/collections/model/ListViewCollection';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import GridCard from 'src/components/common/gridCard/GridCard';
import { Link } from 'src/components/common/Link';
import Thumbnails from 'src/components/playlists/thumbnails/Thumbnails';
import PlaylistOwnerBadge from 'src/components/playlists/playlistHeader/PlaylistOwnerBadge';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { CopyButton } from 'src/components/common/copyLinkButton/CopyButton';
import { Constants } from 'src/AppConstants';
import s from './style.module.less';

interface PlaylistCardProps {
  playlist: ListViewCollection;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const linkCopiedHotjarEvent = () =>
    AnalyticsFactory.hotjar().event(HotjarEvents.PlaylistLinkCopied);

  return (
    <li data-qa="playlist-card">
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
          <Link tabIndex={-1} to={`/playlists/${playlist.id}`} aria-hidden>
            <Thumbnails videos={playlist.videos} />
          </Link>
        }
        subheader={
          <div className={s.playlistSubheader}>
            <PlaylistOwnerBadge playlist={playlist} />
          </div>
        }
        footer={
          <FeatureGate product={Product.B2B}>
            <div className="p-2 items-end flex">
              <CopyButton
                ariaLabel="Copy playlist link"
                textToCopy={`${Constants.HOST}/playlists/${playlist.id}`}
                dataQa={`share-playlist-button-${playlist.id}`}
                onCopy={linkCopiedHotjarEvent}
              />
            </div>
          </FeatureGate>
        }
      />
    </li>
  );
};

export default PlaylistCard;
