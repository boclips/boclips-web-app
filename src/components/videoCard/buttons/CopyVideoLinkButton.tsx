import { Video } from 'boclips-api-client/dist/types';
import React from 'react';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { buildVideoDetailsLink } from 'src/services/buildVideoDetailsLink';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { trackCopyVideoShareLink } from 'src/components/common/analytics/Analytics';
import { CopyLinkButton } from 'src/components/common/copyLinkButton/CopyLinkButton';

interface Props {
  video: Video;
  onClick?: () => void;
}

export const CopyVideoLinkButton = ({ video, onClick }: Props) => {
  const apiClient = useBoclipsClient();
  const { data: user, isFetched } = useGetUserQuery();

  const link = React.useMemo(
    () => (video && user ? buildVideoDetailsLink(video, user) : undefined),
    [video, user],
  );

  const handleCopied = () => {
    trackCopyVideoShareLink(video, apiClient);

    if (onClick) {
      onClick();
    }
  };

  return (
    <CopyLinkButton
      ariaLabel="Copy video link"
      onCopy={handleCopied}
      link={link}
      disabled={!isFetched}
      dataQa={`copy-button-${video.id}`}
    />
  );
};
