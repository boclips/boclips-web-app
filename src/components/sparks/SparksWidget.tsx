import React from 'react';
import { SparksHeader } from 'src/components/sparks/SparksHeader';
import SparksCard from 'src/components/sparks/SparksCard';
import { getAllProviders } from 'src/views/openstax/provider/AlignmentProviderFactory';
import s from './sparksWidget.module.less';

export const SparksWidget = () => {
  const providers = getAllProviders();

  return (
    <main
      tabIndex={-1}
      className="col-start-2 col-end-26 row-start-2 row-end-2 lg:col-start-4 lg:col-end-24 md:pt-4"
    >
      <SparksHeader />
      <div className={s.sparksCardWrapper}>
        {providers.map((provider) => (
          <SparksCard key={provider.name} provider={provider} />
        ))}
      </div>
    </main>
  );
};
