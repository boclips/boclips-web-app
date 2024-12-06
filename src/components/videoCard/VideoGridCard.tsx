import CoverWithVideo, {
  OnSegmentPlayedEvent,
} from '@components/playlists/coverWithVideo/CoverWithVideo';
import GridCard from '@components/common/gridCard/GridCard';
import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { FilterKey } from '@src/types/search/FilterKey';
import GridCardSubHeader from '@components/videoCard/GridCardSubHeader';
import DisplayPrice from '@components/common/price/DisplayPrice';

interface Props {
  video: Video;
  onSegmentPlayed?: OnSegmentPlayedEvent;
  onLinkClicked?: () => void;
  handleFilterChange?: (filterKey: FilterKey, values: string[]) => void;
  buttonsRow: React.ReactElement;
  disableLink?: boolean;
}

const VideoGridCard = ({
  video,
  onSegmentPlayed,
  onLinkClicked,
  handleFilterChange,
  buttonsRow,
  disableLink = false,
}: Props) => (
  <GridCard
    link={disableLink ? null : `/videos/${video.id}`}
    onLinkClicked={onLinkClicked}
    key={video.id}
    name={video.title}
    header={<CoverWithVideo video={video} onSegmentPlayed={onSegmentPlayed} />}
    playerBadge={video?.price && <DisplayPrice price={video.price} />}
    subheader={
      <GridCardSubHeader
        onClick={() =>
          handleFilterChange && handleFilterChange('channel', [video.channelId])
        }
        video={video}
      />
    }
    footer={buttonsRow}
  />
);

export default VideoGridCard;
