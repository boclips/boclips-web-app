import React from 'react';

interface Props {
  children: React.ReactNode;
}

export const Main = ({ children }: Props) => {
  return (
    <main className="col-start-1 col-end-27 grid grid-cols-container gap-x-2 lg:gap-x-6">
      {children}
    </main>
  );
};
