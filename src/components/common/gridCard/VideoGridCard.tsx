import CoverWithVideo from 'src/components/playlists/coverWithVideo/CoverWithVideo';
import { PriceBadge } from 'src/components/common/price/PriceBadge';
import ReleasedOn from '@boclips-ui/released-on';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import { FeatureGate } from 'src/components/common/FeatureGate';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import GridCard from 'src/components/common/gridCard/GridCard';
import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { Typography } from '@boclips-ui/typography';
import s from 'src/components/common/gridCard/style.module.less';

interface Props {
  video: Video;
  addToCartAppCuesEvent: AppcuesEvent;
  onCleanupAddToPlaylist?: (playlistId: string, cleanUp: () => void) => void;
}

const VideoGridCard = ({
  video,
  addToCartAppCuesEvent,
  onCleanupAddToPlaylist,
}: Props) => (
  <GridCard
    link={`/videos/${video.id}`}
    key={video.id}
    name={video.title}
    header={<CoverWithVideo video={video} />}
    price={
      video.price && <PriceBadge price={video.price} className="text-xl" />
    }
    subheader={
      <div className={s.videoSubheader}>
        <Typography.Body as="div" size="small">
          {video.playback.duration.format('mm:ss')}
        </Typography.Body>
        <ReleasedOn releasedOn={video.releasedOn} />
        <Typography.Body as="div" size="small">
          {video.createdBy}
        </Typography.Body>
      </div>
    }
    footer={
      <div className="flex flex-row justify-between p-1 self-end">
        <AddToPlaylistButton
          videoId={video.id}
          onCleanup={onCleanupAddToPlaylist}
        />

        <FeatureGate linkName="cart">
          <AddToCartButton
            video={video}
            key="cart-button"
            width="100px"
            removeButtonWidth="120px"
            appcueEvent={addToCartAppCuesEvent}
            iconOnly
          />
        </FeatureGate>
      </div>
    }
  />
);

export default VideoGridCard;
