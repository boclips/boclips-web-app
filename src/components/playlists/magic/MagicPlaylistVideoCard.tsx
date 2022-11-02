import { Video } from 'boclips-api-client/dist/types';
import React, { useState } from 'react';
import { PlaylistVideoCardButtons } from 'src/components/playlists/magic/VideoPedagogyTagCardButtons';
import Badge from '@boclips-ui/badge';
import CoverWithVideo from 'src/components/playlists/coverWithVideo/CoverWithVideo';

interface Props {
  video: Video;
  id: string;
}

export const MagicPlaylistVideoCard = ({ video, id }: Props) => {
  const tags = [
    { id: '1', label: 'Brain break' },
    { id: '2', label: 'Context builder' },
    { id: '3', label: 'Experiment' },
    { id: '4', label: 'Explainer' },
    { id: '5', label: 'Hook' },
    { id: '6', label: 'Review' },
    { id: '7', label: 'Other' },
  ];

  const index = Math.floor(Math.random() * tags.length);
  const [tag, setTag] = useState(tags[index]);

  const saveTag = (t, vid) => {
    setTag(t);
    // save to DB if needed
    console.log(`saving tag '${t.label}' for video ${vid.id}`);
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
        <Badge value={tag.label} />
      </span>
      <span>{video.title}</span>
      <PlaylistVideoCardButtons
        video={video}
        currentTag={tag}
        tags={tags}
        setTagCallback={(t) => saveTag(t, video)}
        visualComponentId={id}
      />
    </div>
  );
};
