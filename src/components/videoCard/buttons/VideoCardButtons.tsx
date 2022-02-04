import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import { FeatureGate } from 'src/components/common/FeatureGate';
import c from 'classnames';
import { AddToPlaylistButton } from 'src/components/videoCard/buttons/addToPlaylistButton/AddToPlaylistButton';
import s from './style.module.less';
import { CopyVideoLinkButton } from './CopyVideoLinkButton';
import { CopyLegacyVideoLinkButton } from './CopyLegacyVideoLinkButton';

interface VideoCardButtonsProps {
  video: Video;
}

export const VideoCardButtons = ({ video }: VideoCardButtonsProps) => {
  return (
    <div className="flex flex-row justify-between" key={`copy-${video.id}`}>
      <div className={c(s.iconOnlyButtons)}>
        <FeatureGate feature="BO_WEB_APP_ENABLE_PLAYLISTS">
          <AddToPlaylistButton videoId={video.id} />
        </FeatureGate>

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
          appcueEvent={AppcuesEvent.ADD_TO_CART_FROM_SEARCH_RESULTS}
        />
      </FeatureGate>
    </div>
  );
};
