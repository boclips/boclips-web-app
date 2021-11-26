import React from 'react';

interface Props {
  rowsSetup: string;
  dataQa?: string;
  children: React.ReactNode;
}

const ResponsiveLayout = ({ rowsSetup, children, dataQa }: Props) => (
  <div
    data-qa={dataQa}
    className={`grid ${rowsSetup} grid-cols-responsive gap-y-6 gap-x-2 lg:gap-x-4 `}
  >
    {children}
  </div>
);

export default ResponsiveLayout;
