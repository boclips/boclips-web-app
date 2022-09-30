import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { EmbedButton } from 'src/components/embedButton/EmbedButton';
import { VideoCardButtons } from 'src/components/videoCard/buttons/VideoCardButtons';
import { DownloadTranscriptButton } from 'src/components/downloadTranscriptButton/DownloadTranscriptButton';

interface OpenstaxCardButtonsProps {
  video: Video;
}

export const OpenstaxVideoCardButtons = ({
  video,
}: OpenstaxCardButtonsProps) => {
  const showEmbedButton = video.links.createEmbedCode;
  const primaryButton = showEmbedButton && <EmbedButton video={video} />;

  const secondaryButton = video.links.transcript && (
    <DownloadTranscriptButton video={video} />
  );

  return (
    <VideoCardButtons
      additionalSecondaryButtons={secondaryButton}
      primaryButton={primaryButton}
      video={video}
    />
  );
};
