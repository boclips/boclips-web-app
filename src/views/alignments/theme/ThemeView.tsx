import React from 'react';
import { Layout } from '@components/layout/Layout';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import { useParams } from 'react-router';
import {
  useGetProvidersQuery,
  useGetThemeByProviderAndId,
} from '@src/hooks/api/alignmentsQuery';
import { Content } from '@components/alignments/themePage/theme/Content';
import { NavigationPanel } from '@components/alignments/themePage/navigationPanel/NavigationPanel';
import { ThemeMobileMenuProvider } from '@components/common/providers/ThemeMobileMenuProvider';
import ThemeSkeletonPage from '@components/skeleton/theme/ThemeSkeletonPage';
import { Helmet } from 'react-helmet';
import PaginationPanel from '@components/alignments/themePage/theme/pagination/PaginationPanel';
import NotFound from '@src/views/notFound/NotFound';
import { AlignmentContextProvider } from '@components/common/providers/AlignmentContextProvider';

const ThemeView = () => {
  const { id, provider: providerNavigationPath } = useParams();
  const { data: theme, isLoading: isThemeLoading } = useGetThemeByProviderAndId(
    providerNavigationPath,
    id,
  );
  const { data: providers, isLoading: areProvidersLoading } =
    useGetProvidersQuery();

  const provider = providers?.find(
    (it) => it.navigationPath === providerNavigationPath,
  );

  const isLoading = isThemeLoading || areProvidersLoading;

  const themeViewLayout = (children: React.ReactNode) => {
    return (
      <>
        {theme?.title && <Helmet title={theme.title} />}
        <Layout
          rowsSetup="grid-rows-theme-detailed-view items-start"
          responsiveLayout
        >
          <Navbar />
          {children}
          <Footer />
        </Layout>
      </>
    );
  };

  if (isLoading) {
    return themeViewLayout(<ThemeSkeletonPage />);
  }
  return provider && theme ? (
    themeViewLayout(
      <ThemeMobileMenuProvider>
        <AlignmentContextProvider provider={provider}>
          <NavigationPanel theme={theme} />
          <Content theme={theme} />
          <PaginationPanel theme={theme} />
        </AlignmentContextProvider>
      </ThemeMobileMenuProvider>,
    )
  ) : (
    <NotFound />
  );
};

export default ThemeView;
