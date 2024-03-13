import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { VideoCard } from '@boclips-ui/video-card';
import { PriceBadge } from 'src/components/common/price/PriceBadge';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { Link } from 'react-router-dom';
import { trackNavigateToVideoDetails } from 'src/components/common/analytics/Analytics';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { Typography } from '@boclips-ui/typography';
import { FilterKey } from 'src/types/search/FilterKey';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import { Segment } from 'boclips-api-client/dist/sub-clients/collections/model/Segment';
import s from './VideoCardWrapper.module.less';
import AnalyticsFactory from '../../services/analytics/AnalyticsFactory';

interface Props {
  video: Video;
  handleFilterChange?: (filter: FilterKey, values: string[]) => void;
  disableTitleLink?: boolean;
  buttonsRow: React.ReactElement;
  segment?: Segment;
}

const VideoCardTitle = ({
  video,
  disableTitleLink = false,
}: Partial<Props>) => {
  const boclipsClient = useBoclipsClient();
  const onClick = () => {
    AnalyticsFactory.hotjar().event(HotjarEvents.VideoPageOpened);
    trackNavigateToVideoDetails(video, boclipsClient);
  };

  return disableTitleLink ? (
    <Typography.Title2 className="inline-flex truncate">
      {video?.title}
    </Typography.Title2>
  ) : (
    <Link
      className="inline-flex"
      onClick={onClick}
      to={`/videos/${video.id}`}
      state={{ userNavigated: true }}
    >
      <Typography.Link className="truncate">{video?.title}</Typography.Link>
    </Link>
  );
};

export const VideoCardWrapper = ({
  video,
  handleFilterChange,
  buttonsRow,
  disableTitleLink = false,
  segment,
}: Props) => {
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
  const priceBadge = () =>
    video.price && (
      <div
        className="absolute top-3 right-4 border-1 border-primary rounded px-2 py-1"
        data-qa="price-badge-container"
      >
        <PriceBadge price={video.price} />
      </div>
    );
  return (
    <div className={s.videoCard}>
      <VideoCard
        key={video.id}
        video={videoWithoutAgeRange}
        videoPlayer={
          <VideoPlayer video={video} showDurationBadge segment={segment} />
        }
        createdBy={createdByLink()}
        topBadge={priceBadge()}
        title={
          <VideoCardTitle video={video} disableTitleLink={disableTitleLink} />
        }
        actions={buttonsRow}
      />
    </div>
  );
};
