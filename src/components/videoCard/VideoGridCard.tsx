import CoverWithVideo, {
  OnSegmentPlayedEvent,
} from 'src/components/playlists/coverWithVideo/CoverWithVideo';
import GridCard from 'src/components/common/gridCard/GridCard';
import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { FilterKey } from 'src/types/search/FilterKey';
import GridCardSubHeader from 'src/components/videoCard/GridCardSubHeader';
import DisplayPrice from 'src/components/common/price/DisplayPrice';
import { useShareCodeReferer } from 'src/components/common/providers/ShareCodeContextProvider';

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
}: Props) => {
  const shareCodeReferer = useShareCodeReferer();

  const link = shareCodeReferer
    ? `/videos/shared/${video.id}`
    : `/videos/${video.id}`;
  return (
    <GridCard
      link={link}
      onLinkClicked={onLinkClicked}
      key={video.id}
      name={video.title}
      header={
        <CoverWithVideo video={video} onSegmentPlayed={onSegmentPlayed} />
      }
      playerBadge={video?.price && <DisplayPrice price={video.price} />}
      subheader={
        <GridCardSubHeader
          onClick={() =>
            handleFilterChange &&
            handleFilterChange('channel', [video.channelId])
          }
          video={video}
        />
      }
      footer={buttonsRow}
    />
  );
};

export default VideoGridCard;
