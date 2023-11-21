import React from 'react';
import { Typography } from '@boclips-ui/typography';
import useFeatureFlags from 'src/hooks/useFeatureFlags';
import s from './style.module.less';

interface LicenseRestrictionsInfoProps {
  displayCTAText?: boolean;
}

const LicenseRestrictionsInfo = ({
  displayCTAText,
}: LicenseRestrictionsInfoProps) => {
  const { features, isLoading: featuresAreLoading } = useFeatureFlags();

  const showLicensingDetails =
    !featuresAreLoading &&
    !features.LICENSE_DURATION_RESTRICTION_CHECKS_DISABLED;

  return (
    showLicensingDetails && (
      <div className={s.licenseRestrictionsInfo}>
        <Typography.Body data-qa="video-restriction-info">
          Videos have restrictions associated with their license.
          {displayCTAText && (
            <span>
              {' '}
              Click on the video title you want to review before checking out.
            </span>
          )}
        </Typography.Body>
      </div>
    )
  );
};

export default LicenseRestrictionsInfo;
