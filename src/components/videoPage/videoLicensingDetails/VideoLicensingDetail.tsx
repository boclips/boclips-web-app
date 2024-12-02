import { Typography } from 'boclips-ui';
import React, { ReactElement } from 'react';
import s from './videoLicensingDetails.module.less';

interface Props {
  title: string;
  value: string | ReactElement;
}

export const VideoLicensingDetail = ({ title, value }: Props) => {
  return (
    <div className={s.licensingDetail}>
      <Typography.Body
        as="span"
        size="small"
        className={s.licensingDetailTitle}
      >
        {title}
      </Typography.Body>
      <Typography.Body as="span" size="small">
        {value}
      </Typography.Body>
    </div>
  );
};
