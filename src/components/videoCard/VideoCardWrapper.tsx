import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { convertVideoFromApi } from 'src/services/convertVideoFromApi';
import { VideoCard } from '@boclips-ui/video-card';
import { PriceBadge } from 'src/components/common/price/PriceBadge';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { Link } from 'react-router-dom';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { trackNavigateToVideoDetails } from 'src/components/common/analytics/Analytics';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { Typography } from '@boclips-ui/typography';
import { VideoCardButtons } from './buttons/VideoCardButtons';
import s from './VideoCardWrapper.module.less';

interface Props {
  video: Video;
}

const VideoCardTitle = ({ video }: Props) => {
  const boclipsClient = useBoclipsClient();
  const onClick = () => {
    AnalyticsFactory.appcues().sendEvent(AppcuesEvent.VIDEO_PAGE_OPENED);
    trackNavigateToVideoDetails(video, boclipsClient);
  };
  return (
    <Link className="inline-flex" onClick={onClick} to={`/videos/${video.id}`}>
      <Typography.Link className="truncate">{video?.title}</Typography.Link>
    </Link>
  );
};

export const VideoCardWrapper = ({ video }: Props) => {
  return (
    <div className={s.videoCard}>
      <VideoCard
        key={video.id}
        video={convertVideoFromApi(video)}
        videoPlayer={<VideoPlayer video={video} showDurationBadge />}
        border="bottom"
        topBadge={<PriceBadge price={video.price} className="text-xl" />}
        title={<VideoCardTitle video={video} />}
        actions={[
          <VideoCardButtons
            video={video}
            key={`video-cart-buttons-${video.id}`}
          />,
        ]}
      />
    </div>
  );
};
