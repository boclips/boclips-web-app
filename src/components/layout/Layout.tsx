import React from 'react';

interface Props {
  rowsSetup: string;
  dataQa?: string;
  children: React.ReactNode;
}

export const Layout = ({ rowsSetup, children, dataQa }: Props) => (
  <div
    data-qa={dataQa}
    className={`grid ${rowsSetup} grid-cols-container gap-y-6 gap-x-2 lg:gap-x-4`}
  >
    {children}
  </div>
);
