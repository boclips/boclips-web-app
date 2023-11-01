import React from 'react';
import { Typography } from '@boclips-ui/typography';
import { FeatureGate } from 'src/components/common/FeatureGate';
import s from './style.module.less';

interface LicenseRestrictionsInfoProps {
  displayCTAText?: boolean;
}

const LicenseRestrictionsInfo = ({
  displayCTAText,
}: LicenseRestrictionsInfoProps) => {
  return (
    <FeatureGate feature="BO_WEB_APP_LICENSING_DETAILS">
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
    </FeatureGate>
  );
};

export default LicenseRestrictionsInfo;
