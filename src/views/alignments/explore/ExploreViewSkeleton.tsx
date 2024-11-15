import React from 'react';
import TypeMenuItemSkeleton from '@src/components/alignments/explore/explorePageMenu/TypeMenuItemSkeleton';
import ThemeCardSkeleton from '@src/components/alignments/explore/themeList/ThemeCardSkeleton';
import ProviderPageHeaderSkeleton from '@src/components/alignments/explore/explorePageHeader/ProviderPageHeaderSkeleton';

export const ExploreViewSkeleton = () => {
  return (
    <main
      className="col-start-2 col-end-26"
      data-qa="Loading details for provider"
    >
      <ProviderPageHeaderSkeleton />
      <TypeMenuItemSkeleton />
      <ThemeCardSkeleton />
    </main>
  );
};
