import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { VideoCardButtons } from 'src/components/videoCard/buttons/VideoCardButtons';
import { EditPedagogyTagButton } from 'src/components/playlists/magic/EditPedagogyTagButton';

interface CardButtonsProps {
  video: Video;
  currentTag: string;
  pedagogyTags: string[];
  setPedagogyTagCallback: (tag) => void;
}

export const PlaylistVideoCardButtons = ({
  video,
  currentTag,
  pedagogyTags,
  setPedagogyTagCallback,
}: CardButtonsProps) => {
  const primaryButton = (
    <EditPedagogyTagButton
      video={video}
      currentTag={currentTag}
      pedagogyTags={pedagogyTags}
      setPedagogyTagCallback={setPedagogyTagCallback}
    />
  );

  return <VideoCardButtons primaryButton={primaryButton} video={video} />;
};
