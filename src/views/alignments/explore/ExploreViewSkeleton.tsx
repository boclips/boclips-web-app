import React from 'react';
import TypeMenuItemSkeleton from 'src/components/sparks/explore/explorePageMenu/TypeMenuItemSkeleton';
import ThemeCardSkeleton from 'src/components/sparks/explore/themeList/ThemeCardSkeleton';
import ProviderPageHeaderSkeleton from 'src/components/sparks/explore/explorePageHeader/ProviderPageHeaderSkeleton';

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
