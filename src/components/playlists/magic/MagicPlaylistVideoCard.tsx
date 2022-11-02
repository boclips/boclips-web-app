import { Video } from 'boclips-api-client/dist/types';
import VideoGridCard from 'src/components/videoCard/VideoGridCard';
import React, { useState } from 'react';
import { PlaylistVideoCardButtons } from 'src/components/playlists/magic/VideoPedagogyTagCardButtons';
import Badge from '@boclips-ui/badge';
import CoverWithVideo from 'src/components/playlists/coverWithVideo/CoverWithVideo';

interface Props {
  video: Video;
  id: string;
}

export const MagicPlaylistVideoCard = ({ video, id }: Props) => {
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
    <div className="flex flex-col">
      <div
        style={{
          width: '100%',
          height: 'auto',
        }}
      >
        <CoverWithVideo video={video} onSegmentPlayed={() => null} />
      </div>
      <span className="pedagogy-tag">
        <Badge value={pedagogyTag} />
      </span>
      <span>{video.title}</span>
      <PlaylistVideoCardButtons
        video={video}
        currentTag={pedagogyTag}
        pedagogyTags={pedagogyTags}
        setPedagogyTagCallback={(t) => savePedagogyTag(t, video)}
        visualComponentId={id}
      />
    </div>
  );
};
