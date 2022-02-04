import { createPriceDisplayValue } from 'src/services/createPriceDisplayValue';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import dateFormat from 'dateformat';
import { getBrowserLocale } from 'src/services/getBrowserLocale';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { AddToPlaylistButton } from 'src/components/videoCard/buttons/addToPlaylistButton/AddToPlaylistButton';
import { CopyVideoLinkButton } from '../videoCard/buttons/CopyVideoLinkButton';
import s from './style.module.less';

interface Props {
  video: Video;
}

export const VideoHeader = ({ video }: Props) => {
  return (
    <>
      <div className="text-2xl font-bold text-gray-900 mb-2">
        {video?.title}
      </div>
      <div className="font-extralight mb-1 text-gray-800">{`ID: ${video?.id}`}</div>
      <div className="flex flex-row mb-6 text-gray-800">
        <div>
          {`Released on ${dateFormat(video?.releasedOn, 'mediumDate')} by`}
        </div>
        <div className="font-medium ml-1">{video?.createdBy}</div>
      </div>
      <div className="font-bold text-2xl text-gray-900">
        {createPriceDisplayValue(
          video?.price?.amount,
          video?.price?.currency,
          getBrowserLocale(),
        )}
      </div>
      <FeatureGate feature="BO_WEB_APP_PRICES">
        <div className="grey-800 mb-4">
          This is an agreed price for your organization
        </div>
      </FeatureGate>

      <div className={s.buttons}>
        <div className={s.iconButtons}>
          <FeatureGate feature="BO_WEB_APP_ENABLE_PLAYLISTS">
            <AddToPlaylistButton videoId={video.id} />
          </FeatureGate>

          <CopyVideoLinkButton
            video={video}
            appcueEvent={AppcuesEvent.COPY_LINK_FROM_VIDEO_PAGE}
          />
        </div>

        <FeatureGate linkName="cart">
          <AddToCartButton
            video={video}
            width="200px"
            appcueEvent={AppcuesEvent.ADD_TO_CART_FROM_VIDEO_PAGE}
          />
        </FeatureGate>
      </div>
    </>
  );
};
