import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { VideoCardButtons } from '@components/videoCard/buttons/VideoCardButtons';
import { DownloadTranscriptButton } from '@components/downloadTranscriptButton/DownloadTranscriptButton';
import { FeatureGate } from '@components/common/FeatureGate';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

interface Props {
  video: Video;
}

export const AlignmentVideoCardButtons = ({ video }: Props) => {
  const secondaryButton = video.links.transcript && (
    <FeatureGate product={Product.LIBRARY}>
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
