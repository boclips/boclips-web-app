import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { VideoCard } from '@boclips-ui/video-card';
import { PriceBadge } from 'src/components/common/price/PriceBadge';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { Link } from 'react-router-dom';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import { trackNavigateToVideoDetails } from 'src/components/common/analytics/Analytics';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { Typography } from '@boclips-ui/typography';
import { FilterKey } from 'src/types/search/FilterKey';
import s from './VideoCardWrapper.module.less';
import { VideoCardButtons } from './buttons/VideoCardButtons';
import AnalyticsFactory from '../../services/analytics/AnalyticsFactory';

interface Props {
  video: Video;
  handleFilterChange?: (filter: FilterKey, values: string[]) => void;
}

const VideoCardTitle = ({ video }: Partial<Props>) => {
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

export const VideoCardWrapper = ({ video, handleFilterChange }: Props) => {
  const videoWithoutAgeRange = { ...video, ageRange: null };

  const onNameClick = () =>
    handleFilterChange && handleFilterChange('channel', [video.channelId]);

  const createdByLink = () => {
    return (
      <button onClick={onNameClick} type="button">
        <Typography.Body as="div" className={s.createdBy} size="small">
          {video.createdBy}
        </Typography.Body>
      </button>
    );
  };
  return (
    <div className={s.videoCard}>
      <VideoCard
        key={video.id}
        video={videoWithoutAgeRange}
        videoPlayer={<VideoPlayer video={video} showDurationBadge />}
        border="bottom"
        createdBy={createdByLink()}
        topBadge={<PriceBadge price={video.price} className="text-xl" />}
        title={<VideoCardTitle video={video} />}
        actions={[
          <VideoCardButtons
            video={video}
            key={`video-cart-buttons-${video.id}`}
            onAddToCart={() => {
              AnalyticsFactory.mixpanel().track('video_details_cart_add');
            }}
          />,
        ]}
      />
    </div>
  );
};
