import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { VideoCardButtons } from 'src/components/videoCard/buttons/VideoCardButtons';
import { DownloadTranscriptButton } from 'src/components/downloadTranscriptButton/DownloadTranscriptButton';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

interface Props {
  video: Video;
}

export const AlignmentVideoCardButtons = ({ video }: Props) => {
  const secondaryButton = video.links.transcript && (
    <FeatureGate product={Product.B2B}>
      <DownloadTranscriptButton video={video} />
    </FeatureGate>
  );

  return (
    <VideoCardButtons
      additionalSecondaryButtons={secondaryButton}
      video={video}
      iconOnly
    />
  );
};
