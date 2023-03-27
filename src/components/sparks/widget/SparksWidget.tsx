import React from 'react';
import { SparksHeader } from 'src/components/sparks/widget/header/SparksHeader';
import SparksCard from 'src/components/sparks/widget/card/SparksCard';
import { useGetProvidersQuery } from 'src/hooks/api/alignmentsQuery';
import { SparksWidgetSkeleton } from 'src/components/sparks/widget/SparksWidgetSkeleton';
import s from './sparksWidget.module.less';

export const SparksWidget = () => {
  const { data: providers, isLoading: areProvidersLoading } =
    useGetProvidersQuery();

  return (
    <main
      tabIndex={-1}
      className="col-start-2 col-end-26 row-start-2 row-end-2 lg:col-start-4 lg:col-end-24 md:pt-4"
    >
      <SparksHeader />
      {areProvidersLoading ? (
        <SparksWidgetSkeleton />
      ) : (
        <div className={s.sparksCardWrapper}>
          {providers.map((provider) => (
            <SparksCard key={provider.name} provider={provider} />
          ))}
        </div>
      )}
    </main>
  );
};
