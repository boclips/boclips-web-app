import React from 'react';
import { PlaylistShareButton } from '@src/components/playlists/playlistHeader/shareButton/PlaylistShareButton';
import c from 'classnames';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import PlaylistDescription from '@src/components/playlists/PlaylistDescription';
import { Typography } from '@boclips-ui/typography';
import PlaylistNavigation from '@src/components/playlists/PlaylistNavigation';
import PlaylistLastUpdatedBadge from '@src/components/playlists/playlistHeader/PlaylistLastUpdatedBadge';
import PlaylistOwnerBadge from '@src/components/playlists/playlistHeader/PlaylistOwnerBadge';
import { FeatureGate } from '@src/components/common/FeatureGate';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { PlaylistShareLinkButton } from '@src/components/shareLinkButton/PlaylistShareLinkButton';
import { OptionsButton } from './OptionsButton';
import s from './style.module.less';

interface Props {
  playlist: Collection;
  showButtons?: boolean;
}

const PlaylistHeader = ({ playlist, showButtons = true }: Props) => {
  return (
    <section
      className={c(
        s.playlistHeaderContainer,
        'grid-row-start-2 grid-row-end-2 col-start-2 col-end-26',
      )}
      aria-labelledby="page-header"
    >
      <PlaylistNavigation playlist={playlist} />
      <div>
        <Typography.H1
          id="page-header"
          size="md"
          className="text-gray-900"
          data-qa="playlistTitle"
        >
          {playlist.title}
        </Typography.H1>
        <div className={s.playlistBadges}>
          <PlaylistOwnerBadge playlist={playlist} />
          <PlaylistLastUpdatedBadge playlist={playlist} />
        </div>
      </div>
      {showButtons && (
        <div className={s.playlistButtons}>
          <FeatureGate product={Product.LIBRARY}>
            <PlaylistShareButton playlist={playlist} />
          </FeatureGate>
          <FeatureGate product={Product.CLASSROOM}>
            <div className={s.playlistButton}>
              <PlaylistShareLinkButton iconOnly={false} playlist={playlist} />
            </div>
          </FeatureGate>
          <OptionsButton playlist={playlist} />
        </div>
      )}
      {playlist.description && (
        <PlaylistDescription description={playlist.description} />
      )}
    </section>
  );
};

export default PlaylistHeader;
