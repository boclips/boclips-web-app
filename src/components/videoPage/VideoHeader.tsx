import { createPriceDisplayValue } from 'src/services/createPriceDisplayValue';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import dateFormat from 'dateformat';
import { getBrowserLocale } from 'src/services/getBrowserLocale';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import { Typography } from '@boclips-ui/typography';
import { CopyVideoLinkButton } from '../videoCard/buttons/CopyVideoLinkButton';
import s from './style.module.less';

interface Props {
  video: Video;
}

export const VideoHeader = ({ video }: Props) => {
  return (
    <>
      <Typography.H3 className="text-gray-900 lg:mb-2">
        {video?.title}
      </Typography.H3>
      <div className="lg:mb-1">
        <Typography.Body
          size="small"
          className="text-gray-800"
        >{`ID: ${video?.id}`}</Typography.Body>
      </div>
      <div className="flex flex-row lg:mb-6 text-gray-800">
        <Typography.Body>
          {`Released on ${dateFormat(video?.releasedOn, 'mediumDate')} by`}
        </Typography.Body>
        <Typography.Body weight="medium" className="font-medium ml-1">
          {video?.createdBy}
        </Typography.Body>
      </div>
      <Typography.H4 className="text-gray-900">
        {createPriceDisplayValue(
          video?.price?.amount,
          video?.price?.currency,
          getBrowserLocale(),
        )}
      </Typography.H4>
      <FeatureGate feature="BO_WEB_APP_PRICES">
        <div className="grey-800 mb-4">
          <Typography.Body className="text-gray-700">
            This is an agreed price for your organization
          </Typography.Body>
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
