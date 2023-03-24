import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { useParams } from 'react-router';
import {
  useGetProvidersQuery,
  useGetThemeByProviderAndId,
} from 'src/hooks/api/alignmentsQuery';
import { Content } from 'src/components/sparks/themePage/theme/Content';
import { NavigationPanel } from 'src/components/sparks/themePage/navigationPanel/NavigationPanel';
import { ThemeMobileMenuProvider } from 'src/components/common/providers/ThemeMobileMenuProvider';
import ThemeSkeletonPage from 'src/components/skeleton/theme/ThemeSkeletonPage';
import { Helmet } from 'react-helmet';
import PaginationPanel from 'src/components/sparks/themePage/theme/pagination/PaginationPanel';
import NotFound from 'src/views/notFound/NotFound';
import { AlignmentContextProvider } from 'src/components/common/providers/AlignmentContextProvider';

const ThemeView = () => {
  const { id, provider: providerNavigationPath } = useParams();
  const { data: theme, isLoading: isThemeLoading } = useGetThemeByProviderAndId(
    providerNavigationPath,
    id,
  );
  const { data: providers, isLoading: areProvidersLoading } =
    useGetProvidersQuery();

  const provider = providers.find(
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
