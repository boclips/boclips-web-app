import React from 'react';
import { SparksHeader } from 'src/components/sparks/SparksHeader';

export const SparksWidget = () => {
  return (
    <main
      tabIndex={-1}
      className="col-start-2 col-end-26 row-start-2 row-end-2 lg:col-start-4 lg:col-end-24 md:pt-4"
    >
      <SparksHeader />
    </main>
  );
};
