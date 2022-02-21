import { Video } from 'boclips-api-client/dist/types';
import React from 'react';
import { Constants } from 'src/AppConstants';
import { CopyLinkButton } from 'src/components/common/copyLinkButton/CopyLinkButton';

interface Props {
  video: Video;
}

export const CopyLegacyVideoLinkButton = ({ video }: Props) => {
  const link = React.useMemo(() => {
    if (!Constants.LEGACY_VIDEOS_URL) {
      console.warn('No constant set for LEGACY_VIDEOS_URL');
    }

    return `${Constants.LEGACY_VIDEOS_URL}/${video.id}`;
  }, [video]);

  return (
    <CopyLinkButton
      ariaLabel="Copy legacy video link"
      link={link}
      dataQa={`copy-legacy-button-${video.id}`}
    />
  );
};
