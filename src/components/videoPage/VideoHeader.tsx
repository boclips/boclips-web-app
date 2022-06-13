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
import c from 'classnames';
import { CopyVideoLinkButton } from '../videoCard/buttons/CopyVideoLinkButton';
import s from './style.module.less';

interface Props {
  video: Video;
}

export const VideoHeader = ({ video }: Props) => {
  return (
    <div className="flex flex-col">
      <div className={s.shrink}>
        <Typography.H1 size="md" className="text-gray-900 lg:mb-2">
          {video?.title}
        </Typography.H1>
        <VideoInfo video={video} />
      </div>

      <div className={c(s.descriptionSection, s.scrollablePanel)}>
        <VideoDescription video={video} />
      </div>

      <div className={c(s.buttons, s.shrink)}>
        <div className={s.iconButtons}>
          <AddToPlaylistButton videoId={video.id} />
          <CopyVideoLinkButton
            video={video}
            appcueEvent={AppcuesEvent.COPY_LINK_FROM_VIDEO_PAGE}
          />
        </div>
        <Typography.H2 size="sm" className="text-gray-900">
          {createPriceDisplayValue(
            video?.price?.amount,
            video?.price?.currency,
            getBrowserLocale(),
          )}
        </Typography.H2>
        <FeatureGate linkName="cart">
          <AddToCartButton
            video={video}
            width="200px"
            appcueEvent={AppcuesEvent.ADD_TO_CART_FROM_VIDEO_PAGE}
          />
        </FeatureGate>
      </div>
    </div>
  );
};
