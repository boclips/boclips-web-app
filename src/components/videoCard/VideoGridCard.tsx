import CoverWithVideo, {
  OnSegmentPlayedEvent,
} from 'src/components/playlists/coverWithVideo/CoverWithVideo';
import GridCard from 'src/components/common/gridCard/GridCard';
import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { FilterKey } from 'src/types/search/FilterKey';
import GridCardSubHeader from 'src/components/videoCard/GridCardSubHeader';

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
      <GridCardSubHeader
        onClick={() =>
          handleFilterChange && handleFilterChange('channel', [video.channelId])
        }
        video={video}
      />
    }
    footer={<div className="p-1 self-end">{buttonsRow}</div>}
  />
);

export default VideoGridCard;
