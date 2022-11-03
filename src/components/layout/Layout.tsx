import React from 'react';
import { ToastContainer } from 'react-toastify';
import s from './layout.module.less';

interface Props {
  rowsSetup: string;
  dataQa?: string;
  children: React.ReactNode;
  responsiveLayout?: boolean;
  className?: string;
}

export const Layout = ({
  rowsSetup,
  children,
  dataQa,
  responsiveLayout = false,
  className,
}: Props) => (
  <div
    data-qa={dataQa}
    className={`grid ${rowsSetup} ${s.layout} ${className} grid-cols-container gap-y-6 gap-x-2 lg:gap-x-6`}
    style={{ minWidth: responsiveLayout ? '320px' : '1160px' }}
  >
    {children}
    <ToastContainer />
  </div>
);
