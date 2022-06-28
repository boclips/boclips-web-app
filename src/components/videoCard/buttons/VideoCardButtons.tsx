import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import { FeatureGate } from 'src/components/common/FeatureGate';
import c from 'classnames';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import s from './style.module.less';
import { CopyVideoLinkButton } from './CopyVideoLinkButton';
import { CopyLegacyVideoLinkButton } from './CopyLegacyVideoLinkButton';

interface VideoCardButtonsProps {
  video: Video;
  onAddToCart?: () => void;
  onAddToPlaylist?: () => void;
  onCleanupAddToPlaylist?: (playlistId: string, cleanUp: () => void) => void;
  iconOnly?: boolean;
}

export const VideoCardButtons = ({
  video,
  onAddToCart,
  onAddToPlaylist,
  onCleanupAddToPlaylist,
  iconOnly = false,
}: VideoCardButtonsProps) => {
  return (
    <div className="flex flex-row justify-between" key={`copy-${video.id}`}>
      <div className={c(s.iconOnlyButtons)}>
        <AddToPlaylistButton
          videoId={video.id}
          onCleanup={onCleanupAddToPlaylist}
          onClick={onAddToPlaylist}
        />

        <FeatureGate feature="BO_WEB_APP_COPY_OLD_LINK_BUTTON">
          <CopyLegacyVideoLinkButton video={video} />
        </FeatureGate>

        <CopyVideoLinkButton
          video={video}
          appcueEvent={AppcuesEvent.COPY_LINK_FROM_SEARCH_RESULTS}
        />
      </div>

      <FeatureGate linkName="cart">
        <AddToCartButton
          video={video}
          key="cart-button"
          width="148px"
          onClick={onAddToCart}
          iconOnly={iconOnly}
        />
      </FeatureGate>
    </div>
  );
};
