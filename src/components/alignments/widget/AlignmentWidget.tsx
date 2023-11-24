import React from 'react';
import { AlignmentHeader } from 'src/components/alignments/widget/header/AlignmentHeader';
import AlignmentCard from 'src/components/alignments/widget/card/AlignmentCard';
import { useGetProvidersQuery } from 'src/hooks/api/alignmentsQuery';
import { AlignmentWidgetSkeleton } from 'src/components/alignments/widget/AlignmentWidgetSkeleton';
import s from './alignmentWidget.module.less';

export const AlignmentWidget = () => {
  const { data: providers, isLoading: areProvidersLoading } =
    useGetProvidersQuery();

  return (
    <main
      tabIndex={-1}
      className="col-start-2 col-end-26 row-start-2 row-end-2 lg:col-start-4 lg:col-end-24 md:pt-4"
    >
      <AlignmentHeader />
      {areProvidersLoading ? (
        <AlignmentWidgetSkeleton />
      ) : (
        <div className={s.alignmentCardWrapper}>
          {providers.map((provider) => (
            <AlignmentCard key={provider.name} provider={provider} />
          ))}
        </div>
      )}
    </main>
  );
};
