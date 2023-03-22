import React, { useEffect, useMemo, useState } from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { ThemeList } from 'src/components/sparks/explore/themeList/ThemeList';
import { TypesMenu } from 'src/components/sparks/explore/explorePageMenu/TypesMenu';
import {
  useGetThemesByProviderQuery,
  useGetTypesByProviderQuery,
} from 'src/hooks/api/alignmentsQuery';
import ProviderPageHeader from 'src/components/sparks/explore/explorePageHeader/ProviderPageHeader';
import { useParams } from 'react-router';
import NotFound from 'src/views/notFound/NotFound';
import {
  getProviderByName,
  isProviderSupported,
} from 'src/views/alignments/provider/AlignmentProviderFactory';
import { AlignmentContextProvider } from 'src/components/common/providers/AlignmentContextProvider';

const ExploreView = () => {
  const ALL = 'All';
  const { provider: providerName } = useParams();
  const { data: themes, isLoading: areThemesLoading } =
    useGetThemesByProviderQuery(providerName);

  const provider = isProviderSupported(providerName)
    ? getProviderByName(providerName)
    : undefined;

  const { data: types, isLoading: areTypesLoading } =
    useGetTypesByProviderQuery(providerName);

  const [currentType, setCurrentType] = useState(ALL);

  const currentTypeThemes = useMemo(
    () =>
      currentType === ALL
        ? themes
        : themes?.filter((theme) => theme.type === currentType),
    [types, currentType, themes],
  );

  useEffect(() => {
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
  }, [currentTypeThemes]);

  const isLoading = areThemesLoading || areTypesLoading;

  return provider ? (
    <Layout rowsSetup="grid-rows-explore-view" responsiveLayout>
      <Navbar />
      <AlignmentContextProvider provider={provider}>
        <ProviderPageHeader />
        <TypesMenu
          types={isLoading ? [] : [ALL, ...types]}
          currentType={currentType}
          onClick={setCurrentType}
          isLoading={isLoading}
        />

        <ThemeList themes={currentTypeThemes} isLoading={isLoading} />
      </AlignmentContextProvider>
      <Footer />
    </Layout>
  ) : (
    <NotFound />
  );
};

export default ExploreView;
