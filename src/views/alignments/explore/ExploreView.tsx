import React, { useEffect, useMemo, useState } from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { ThemeList } from 'src/components/sparks/explore/themeList/ThemeList';
import { TypesMenu } from 'src/components/sparks/explore/explorePageMenu/TypesMenu';
import {
  useGetProvidersQuery,
  useGetThemesByProviderQuery,
} from 'src/hooks/api/alignmentsQuery';
import ProviderPageHeader from 'src/components/sparks/explore/explorePageHeader/ProviderPageHeader';
import { useParams } from 'react-router';
import NotFound from 'src/views/notFound/NotFound';
import { AlignmentContextProvider } from 'src/components/common/providers/AlignmentContextProvider';
import { Helmet } from 'react-helmet';
import { ExploreViewSkeleton } from 'src/views/alignments/explore/ExploreViewSkeleton';

const ExploreView = () => {
  const ALL = 'All';
  const { provider: providerNavigationPath } = useParams();
  const { data: themes, isLoading: areThemesLoading } =
    useGetThemesByProviderQuery(providerNavigationPath);
  const { data: providers, isLoading: areProvidersLoading } =
    useGetProvidersQuery();

  const provider = providers?.find(
    (it) => it.navigationPath === providerNavigationPath,
  );

  const [currentType, setCurrentType] = useState(ALL);

  const currentTypeThemes = useMemo(
    () =>
      currentType === ALL
        ? themes
        : themes?.filter((theme) => theme.type === currentType),
    [currentType, themes],
  );

  const isLoading = areThemesLoading || areProvidersLoading;

  useEffect(() => {
    if (!isLoading) {
      const firstTheme = currentTypeThemes?.[0];
      const isNavFocused = document
        .querySelector('main')
        .contains(document.activeElement);

      if (firstTheme !== undefined && isNavFocused) {
        const element: HTMLButtonElement = document.querySelector(
          `[aria-label="theme ${firstTheme.title}"]`,
        );
        element.focus();
      }
    }
  }, [currentTypeThemes, isLoading]);

  const exploreViewLayout = (children: React.ReactNode) => {
    return (
      <Layout rowsSetup="grid-rows-explore-view" responsiveLayout>
        <Navbar />
        {children}
        <Footer />
      </Layout>
    );
  };

  if (isLoading) {
    return exploreViewLayout(<ExploreViewSkeleton />);
  }

  return provider ? (
    exploreViewLayout(
      <AlignmentContextProvider provider={provider}>
        <Helmet title={provider.name} />
        <ProviderPageHeader />
        <TypesMenu
          types={[ALL, ...provider.types]}
          currentType={currentType}
          onClick={setCurrentType}
        />

        <ThemeList themes={currentTypeThemes} />
      </AlignmentContextProvider>,
    )
  ) : (
    <NotFound />
  );
};

export default ExploreView;
