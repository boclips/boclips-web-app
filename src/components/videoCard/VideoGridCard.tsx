import CoverWithVideo, {
  OnSegmentPlayedEvent,
} from 'src/components/playlists/coverWithVideo/CoverWithVideo';
import GridCard from 'src/components/common/gridCard/GridCard';
import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { Typography } from '@boclips-ui/typography';
import s from 'src/components/common/gridCard/style.module.less';
import { createPriceDisplayValue } from 'src/services/createPriceDisplayValue';
import { getBrowserLocale } from 'src/services/getBrowserLocale';
import { FilterKey } from 'src/types/search/FilterKey';
import Badge from '@boclips-ui/badge';

interface Props {
  video: Video;
  onSegmentPlayed?: OnSegmentPlayedEvent;
  onLinkClicked?: () => void;
  handleFilterChange?: (filterKey: FilterKey, values: string[]) => void;
  buttonsRow: React.ReactElement;
}

const VideoGridCard = ({
  video,
  onSegmentPlayed,
  onLinkClicked,
  handleFilterChange,
  buttonsRow,
}: Props) => (
  <GridCard
    link={`/videos/${video.id}`}
    onLinkClicked={onLinkClicked}
    key={video.id}
    name={video.title}
    header={<CoverWithVideo video={video} onSegmentPlayed={onSegmentPlayed} />}
    playerBadge={
      video.playback.duration && (
        <div className="text-white">
          {video.playback.duration.format('mm:ss')}
        </div>
      )
    }
    subheader={
      <div className={s.videoSubheader}>
        {video.bestFor[0] && <Badge value={video.bestFor[0].label} />}

        {video.price && (
          <Typography.Body as="span" size="small">
            {createPriceDisplayValue(
              video.price?.amount,
              video.price?.currency,
              getBrowserLocale(),
            )}
          </Typography.Body>
        )}

        <span>
          <button
            onClick={() =>
              handleFilterChange &&
              handleFilterChange('channel', [video.channelId])
            }
            type="button"
          >
            <Typography.Body as="div" size="small" className={s.createdBy}>
              {video.createdBy}
            </Typography.Body>
          </button>
        </span>
      </div>
    }
    footer={<div className="p-1 self-end">{buttonsRow}</div>}
  />
);

export default VideoGridCard;
