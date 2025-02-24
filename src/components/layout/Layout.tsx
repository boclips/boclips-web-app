import React from 'react';
import s from './layout.module.less';

interface Props {
  rowsSetup: string;
  dataQa?: string;
  children: React.ReactNode;
  responsiveLayout?: boolean;
  backgroundColor?: string;
}

export const Layout = ({
  rowsSetup,
  children,
  dataQa,
  backgroundColor,
  responsiveLayout = false,
}: Props) => (
  <div
    data-qa={dataQa}
    className={`grid ${rowsSetup} ${s.layout} grid-cols-container gap-y-6 gap-x-2 lg:gap-x-6`}
    style={{
      minWidth: responsiveLayout ? '320px' : '1160px',
      background: backgroundColor || '#FFF',
    }}
  >
    {children}
  </div>
);
