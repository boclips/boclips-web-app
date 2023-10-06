import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import React, { ReactElement } from 'react';
import c from 'classnames';
import { Typography } from '@boclips-ui/typography';
import { VideoLicensingDetail } from 'src/components/videoPage/videoLicensingDetails/VideoLicensingDetail';
import { getVideoPageLicenseDurationLabel } from 'src/services/getVideoLicenseDurationLabel';
import s from './videoLicensingDetails.module.less';

interface Props {
  video: Video;
}

export const VideoLicensingDetails = ({ video }: Props) => {
  const getEditingRestrictionsLabel = (
    permission: string,
  ): string | ReactElement => {
    if (permission === 'ALLOWED_WITH_RESTRICTIONS') {
      return 'Additional restrictions apply as well as standard editing policy';
    }
    if (permission === 'NOT_ALLOWED') {
      return 'Full Restrictions in place. No editing allowed.';
    }
    if (permission === 'ALLOWED') {
      return (
        <>
          Follow <Typography.Link>standard editing policy</Typography.Link>
        </>
      );
    }
  };

  return (
    <section className={c(s.scrollableLicensingDetails)}>
      <Typography.H1 size="xs" weight="medium" className="text-gray-900">
        Licensing Details
      </Typography.H1>

      <div className="flex flex-col mt-2">
        <VideoLicensingDetail
          title="Maximum Licensing Term"
          value={getVideoPageLicenseDurationLabel(
            video.maxLicenseDurationYears,
          )}
        />

        {video.restrictions?.editing?.permission && (
          <VideoLicensingDetail
            title="Editing restrictions"
            value={getEditingRestrictionsLabel(
              video.restrictions.editing.permission,
            )}
          />
        )}
      </div>
    </section>
  );
};
