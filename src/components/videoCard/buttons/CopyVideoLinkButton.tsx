import { Video } from 'boclips-api-client/dist/types';
import React from 'react';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { buildVideoDetailsLink } from 'src/services/buildVideoDetailsLink';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import { trackCopyVideoShareLink } from 'src/components/common/analytics/Analytics';
import { CopyLinkButton } from 'src/components/common/copyLinkButton/CopyLinkButton';

interface Props {
  video: Video;
  appcueEvent?: AppcuesEvent;
}

export const CopyVideoLinkButton = ({ video, appcueEvent }: Props) => {
  const apiClient = useBoclipsClient();
  const { data: user, isFetched } = useGetUserQuery();

  const link = React.useMemo(
    () => (video && user ? buildVideoDetailsLink(video, user) : undefined),
    [video, user],
  );

  const handleCopied = () => {
    trackCopyVideoShareLink(video, apiClient);

    if (appcueEvent) {
      AnalyticsFactory.getAppcues().sendEvent(appcueEvent);
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
