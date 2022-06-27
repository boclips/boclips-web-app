import { createPriceDisplayValue } from 'src/services/createPriceDisplayValue';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { getBrowserLocale } from 'src/services/getBrowserLocale';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import { Typography } from '@boclips-ui/typography';
import { VideoInfo } from 'src/components/common/videoInfo/VideoInfo';
import { VideoDescription } from 'src/components/videoPage/VideoDescription';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { CopyVideoLinkButton } from '../videoCard/buttons/CopyVideoLinkButton';
import s from './style.module.less';

interface Props {
  video: Video;
}

export const VideoHeaderWithDescription = ({ video }: Props) => {
  return (
    <>
      <div className={s.sticky}>
        <Typography.H1 size="md" className="text-gray-900">
          {video?.title}
        </Typography.H1>
        <Typography.H2 size="sm" className="text-gray-900 my-1">
          {createPriceDisplayValue(
            video?.price?.amount,
            video?.price?.currency,
            getBrowserLocale(),
          )}
        </Typography.H2>
        <VideoInfo video={video} />
      </div>

      <div className={s.scrollableDescription}>
        <VideoDescription video={video} />
      </div>
      <div className={(s.sticky, s.buttons)}>
        <div className={s.iconButtons}>
          <AddToPlaylistButton videoId={video.id} />
          <CopyVideoLinkButton
            video={video}
            appcueEvent={AppcuesEvent.COPY_LINK_FROM_VIDEO_PAGE}
          />
        </div>
        <FeatureGate linkName="cart">
          <AddToCartButton
            video={video}
            width="200px"
            onClick={() => {
              AnalyticsFactory.appcues().sendEvent(
                AppcuesEvent.ADD_TO_CART_FROM_VIDEO_PAGE,
              );
              AnalyticsFactory.mixpanel().track('video_details_cart_add');
            }}
          />
        </FeatureGate>
      </div>
    </>
  );
};
