import React from 'react';
import { ToastContainer } from 'react-toastify';

interface Props {
  rowsSetup: string;
  dataQa?: string;
  children: React.ReactNode;
  responsiveLayout?: boolean;
}

export const Layout = ({
  rowsSetup,
  children,
  dataQa,
  responsiveLayout = false,
}: Props) => (
  <div
    data-qa={dataQa}
    className={`grid ${rowsSetup} grid-cols-container gap-y-6 gap-x-2 lg:gap-x-6 h-screen`}
    style={{ minWidth: responsiveLayout ? '320px' : '1160px' }}
  >
    {children}
    <ToastContainer />
  </div>
);
