import { AppcuesEvent } from 'src/types/AppcuesEvent';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import { Typography } from '@boclips-ui/typography';
import { VideoInfo } from 'src/components/common/videoInfo/VideoInfo';
import { VideoDescription } from 'src/components/videoPage/VideoDescription';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { EmbedButton } from 'src/components/embedButton/EmbedButton';
import { DownloadTranscriptButton } from 'src/components/downloadTranscriptButton/DownloadTranscriptButton';
import { PriceBadge } from 'src/components/common/price/PriceBadge';
import { CopyVideoLinkButton } from '../videoCard/buttons/CopyVideoLinkButton';
import s from './style.module.less';

interface Props {
  video?: Video;
}

export const VideoHeaderWithDescription = ({ video }: Props) => {
  if (!video) {
    return null;
  }
  const videoHasTranscript = video?.links?.transcript;

  const mixpanel = AnalyticsFactory.mixpanel();
  const trackVideoCopy = () => {
    AnalyticsFactory.appcues().sendEvent(
      AppcuesEvent.COPY_LINK_FROM_VIDEO_PAGE,
    );
    mixpanel.track('video_details_url_copied');
  };

  return (
    <>
      <div className={s.sticky}>
        <Typography.H1 size="md" className="text-gray-900" id="video-title">
          {video?.title}
        </Typography.H1>
        {video?.price && <PriceBadge price={video.price} />}
        <FeatureGate feature="BO_WEB_APP_PRICES">
          <div className="mb-4">
            <Typography.Body size="small" className="text-gray-700">
              This is an agreed price for your organization
            </Typography.Body>
          </div>
        </FeatureGate>
        <VideoInfo video={video} />
      </div>

      <div className={s.descriptionAndButtons}>
        <div className={s.scrollableDescription}>
          <VideoDescription video={video} />
        </div>
        <div className={(s.sticky, s.buttons)}>
          <div className={s.iconButtons}>
            <AddToPlaylistButton
              videoId={video?.id}
              onClick={() => {
                mixpanel.track('video_details_playlist_add');
              }}
            />
            <CopyVideoLinkButton video={video} onClick={trackVideoCopy} />
            {videoHasTranscript && <DownloadTranscriptButton video={video} />}
          </div>
          {video?.links?.createEmbedCode ? (
            <EmbedButton video={video} iconOnly={false} />
          ) : (
            <FeatureGate linkName="cart">
              <AddToCartButton
                video={video}
                width="200px"
                onClick={() => {
                  AnalyticsFactory.appcues().sendEvent(
                    AppcuesEvent.ADD_TO_CART_FROM_VIDEO_PAGE,
                  );
                  mixpanel.track('video_details_cart_add');
                }}
              />
            </FeatureGate>
          )}
        </div>
      </div>
    </>
  );
};
