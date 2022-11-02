import { Video } from 'boclips-api-client/dist/types';
import VideoGridCard from 'src/components/videoCard/VideoGridCard';
import React, { useState } from 'react';
import { PlaylistVideoCardButtons } from 'src/components/playlists/magic/VideoPedagogyTagCardButtons';
import Badge from '@boclips-ui/badge';

interface Props {
  video: Video;
  visualComponentId: string;
}

export const MagicPlaylistVideoCard = ({ video, visualComponentId }: Props) => {
  const pedagogyTags = [
    'Brain break',
    'Context builder',
    'Experiment',
    'Explainer',
    'Hook',
    'Review',
    'Other',
  ];

  const index = Math.floor(Math.random() * pedagogyTags.length);
  const [pedagogyTag, setPedagogyTag] = useState(pedagogyTags[index]);

  const savePedagogyTag = (tag, vid) => {
    setPedagogyTag(tag);
    // save to DB if needed
    console.log(`saving pedagogy tag '${tag}' for video ${vid.id}`);
  };

  return (
    <VideoGridCard
      key={video.id}
      video={video}
      buttonsRow={
        <>
          <span className="pedagogy-tag">
            <Badge value={pedagogyTag} />
          </span>
          <PlaylistVideoCardButtons
            video={video}
            currentTag={pedagogyTag}
            pedagogyTags={pedagogyTags}
            visualComponentId={visualComponentId}
            setPedagogyTagCallback={(t) => savePedagogyTag(t, video)}
          />
        </>
      }
    />
  );
};
