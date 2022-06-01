import CoverWithVideo from 'src/components/playlists/coverWithVideo/CoverWithVideo';
import { PriceBadge } from 'src/components/common/price/PriceBadge';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import { FeatureGate } from 'src/components/common/FeatureGate';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import GridCard from 'src/components/common/gridCard/GridCard';
import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';

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
            labelAdd="Add"
            appcueEvent={addToCartAppCuesEvent}
          />
        </FeatureGate>
      </div>
    }
  />
);

export default VideoGridCard;
