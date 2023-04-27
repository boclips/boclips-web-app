import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { VideoCardButtons } from 'src/components/videoCard/buttons/VideoCardButtons';
import { DownloadTranscriptButton } from 'src/components/downloadTranscriptButton/DownloadTranscriptButton';

interface Props {
  video: Video;
}

export const SparksVideoCardButtons = ({ video }: Props) => {
  const secondaryButton = video.links.transcript && (
    <DownloadTranscriptButton video={video} />
  );

  return (
    <VideoCardButtons
      additionalSecondaryButtons={secondaryButton}
      video={video}
      iconOnly
    />
  );
};
