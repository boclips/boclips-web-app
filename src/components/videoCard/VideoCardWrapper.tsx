import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { VideoCard } from '@boclips-ui/video-card';
import { PriceBadge } from 'src/components/common/price/PriceBadge';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { Link } from 'react-router-dom';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { trackNavigateToVideoDetails } from 'src/components/common/analytics/Analytics';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { VideoCardButtons } from './buttons/VideoCardButtons';
import s from './VideoCardWrapper.module.less';

interface Props {
  video: Video;
}

export const VideoCardWrapper = ({ video }: Props) => {
  const boclipsClient = useBoclipsClient();

  const VideoCardTitle = () => {
    const onClick = () => {
      AnalyticsFactory.getAppcues().sendEvent(AppcuesEvent.VIDEO_PAGE_OPENED);
      trackNavigateToVideoDetails(video, boclipsClient);
    };
    return (
      <Link onClick={onClick} to={`/videos/${video.id}`}>
        <div className="text-gray-900">{video?.title}</div>
      </Link>
    );
  };

  return (
    <div className={s.videoCard}>
      <VideoCard
        key={video.id}
        video={video}
        videoPlayer={<VideoPlayer video={video} showDurationBadge />}
        border="bottom"
        topBadge={<PriceBadge price={video.price} className="text-xl" />}
        title={<VideoCardTitle />}
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
