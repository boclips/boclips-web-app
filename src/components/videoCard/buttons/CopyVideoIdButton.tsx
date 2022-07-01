import { Video } from 'boclips-api-client/dist/types';
import React from 'react';
import { CopyButton } from 'src/components/common/copyLinkButton/CopyButton';

interface Props {
  video: Video;
}

export const CopyVideoIdButton = ({ video }: Props) => {
  return (
    <CopyButton
      ariaLabel="Copy video id"
      textToCopy={video.id}
      dataQa={`copy-video-id-button-${video.id}`}
    />
  );
};
