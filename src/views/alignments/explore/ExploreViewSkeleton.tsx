import React from 'react';
import TypeMenuItemSkeleton from '@components/alignments/explore/explorePageMenu/TypeMenuItemSkeleton';
import ThemeCardSkeleton from '@components/alignments/explore/themeList/ThemeCardSkeleton';
import ProviderPageHeaderSkeleton from '@components/alignments/explore/explorePageHeader/ProviderPageHeaderSkeleton';

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
