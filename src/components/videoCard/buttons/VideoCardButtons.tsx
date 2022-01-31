import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import { FeatureGate } from 'src/components/common/FeatureGate';
import Button from '@boclips-ui/button';
import PlaylistAddIcon from 'resources/icons/playlist-add.svg';
import c from 'classnames';
import { Tooltip } from '@boclips-ui/tooltip';
import s from './style.module.less';
import { CopyVideoLinkButton } from './CopyVideoLinkButton';
import { CopyLegacyVideoLinkButton } from './CopyLegacyVideoLinkButton';

interface VideoCardButtonsProps {
  video: Video;
}

export const VideoCardButtons = ({ video }: VideoCardButtonsProps) => {
  return (
    <div className="flex flex-row justify-between" key={`copy-${video.id}`}>
      <div className={c(s.iconOnlyButtons, 'flex flex-row flex-start')}>
        <FeatureGate feature="BO_WEB_APP_ENABLE_PLAYLISTS">
          <Tooltip text="Add to playlist">
            <span>
              <Button
                text="Add to playlist"
                aria-label="Add to playlist"
                iconOnly
                icon={<PlaylistAddIcon />}
                onClick={() => null}
                type="outline"
                width="40px"
                height="40px"
              />
            </span>
          </Tooltip>
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
