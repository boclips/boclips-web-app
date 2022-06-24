import CoverWithVideo, {
  OnSegmentPlayedEvent,
} from 'src/components/playlists/coverWithVideo/CoverWithVideo';
import GridCard from 'src/components/common/gridCard/GridCard';
import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { Typography } from '@boclips-ui/typography';
import s from 'src/components/common/gridCard/style.module.less';
import { VideoCardButtons } from 'src/components/videoCard/buttons/VideoCardButtons';
import { createPriceDisplayValue } from 'src/services/createPriceDisplayValue';
import { getBrowserLocale } from 'src/services/getBrowserLocale';
import { AddToCartCallback } from 'src/types/AddToCartCallback';

interface Props {
  video: Video;
  onAddToCart: AddToCartCallback;
  onCleanupAddToPlaylist?: (playlistId: string, cleanUp: () => void) => void;
  onSegmentPlayed?: OnSegmentPlayedEvent;
}

const VideoGridCard = ({
  video,
  onAddToCart,
  onCleanupAddToPlaylist,
  onSegmentPlayed,
}: Props) => (
  <GridCard
    link={`/videos/${video.id}`}
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
        {video.price && (
          <Typography.Body as="div" size="small">
            {createPriceDisplayValue(
              video.price?.amount,
              video.price?.currency,
              getBrowserLocale(),
            )}
          </Typography.Body>
        )}
        <Typography.Body as="div" size="small">
          {video.createdBy}
        </Typography.Body>
      </div>
    }
    footer={
      <div className="p-1 self-end">
        <VideoCardButtons
          video={video}
          onCleanupAddToPlaylist={onCleanupAddToPlaylist}
          onAddToCart={onAddToCart}
          iconOnly
        />
      </div>
    }
  />
);

export default VideoGridCard;
