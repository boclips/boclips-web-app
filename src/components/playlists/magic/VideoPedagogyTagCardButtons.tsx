import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { VideoCardButtons } from 'src/components/videoCard/buttons/VideoCardButtons';
import { EditBestForTagButton } from 'src/components/playlists/magic/EditBestForTagButton';
import { BestForTag } from 'boclips-api-client/dist/sub-clients/bestForTags/model/BestForTag';

interface CardButtonsProps {
  video: Video;
  currentTag: BestForTag;
  tags: BestForTag[];
  setTagCallback: (tag) => void;
}

export const PlaylistVideoCardButtons = ({
  video,
  currentTag,
  tags,
  setTagCallback,
}: CardButtonsProps) => {
  return (
    <VideoCardButtons
      primaryButton={
        <EditBestForTagButton
          video={video}
          currentTag={currentTag}
          tags={tags}
          setTagCallback={setTagCallback}
        />
      }
      video={video}
    />
  );
};
