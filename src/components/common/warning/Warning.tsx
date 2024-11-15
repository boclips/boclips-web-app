import React from 'react';
import s from '@src/components/common/warning/style.module.less';

interface WarningProps {
  children: React.ReactElement | React.ReactElement[];
}

export const Warning = ({ children }: WarningProps) => {
  return <div className={s.warning}>{children}</div>;
};
