import React from 'react';
import { Typography } from '@boclips-ui/typography';
import useFeatureFlags from 'src/hooks/useFeatureFlags';
import { Warning } from 'src/components/common/warning/Warning';

interface LicenseRestrictionsInfoProps {
  displayCTAText?: boolean;
}

const LicenseRestrictionsInfo = ({
  displayCTAText,
}: LicenseRestrictionsInfoProps) => {
  const { features, isLoading: featuresAreLoading } = useFeatureFlags();

  const showLicensingDetails =
    !featuresAreLoading && !features.BO_WEB_APP_HIDE_LICENSE_RESTRICTIONS;

  return (
    showLicensingDetails && (
      <Warning>
        <Typography.Body data-qa="video-restriction-info">
          Videos have restrictions associated with their license.
          {displayCTAText && (
            <span>
              {' '}
              Click on the video title you want to review before proceeding with
              billing..
            </span>
          )}
        </Typography.Body>
      </Warning>
    )
  );
};

export default LicenseRestrictionsInfo;
