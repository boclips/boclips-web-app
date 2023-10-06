import { Typography } from '@boclips-ui/typography';
import React, { ReactElement } from 'react';
import s from './videoLicensingDetails.module.less';

interface Props {
  title: string;
  value: string | ReactElement;
}

export const VideoLicensingDetail = ({ title, value }: Props) => {
  return (
    <div className={s.licensingDetail}>
      <Typography.Body as="p" size="small" className={s.licensingDetailTitle}>
        {title}
      </Typography.Body>
      <Typography.Body as="p" size="small">
        {value}
      </Typography.Body>
    </div>
  );
};
