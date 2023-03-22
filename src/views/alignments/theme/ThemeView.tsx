import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { useParams } from 'react-router';
import { useGetThemeByProviderAndId } from 'src/hooks/api/alignmentsQuery';
import { Content } from 'src/components/sparks/themePage/theme/Content';
import { NavigationPanel } from 'src/components/sparks/themePage/navigationPanel/NavigationPanel';
import { ThemeMobileMenuProvider } from 'src/components/common/providers/ThemeMobileMenuProvider';
import ThemeSkeletonPage from 'src/components/skeleton/theme/ThemeSkeletonPage';
import { Helmet } from 'react-helmet';
import PaginationPanel from 'src/components/sparks/themePage/theme/pagination/PaginationPanel';
import {
  getProviderByName,
  isProviderSupported,
} from 'src/views/alignments/provider/AlignmentProviderFactory';
import NotFound from 'src/views/notFound/NotFound';
import { AlignmentContextProvider } from 'src/components/common/providers/AlignmentContextProvider';

const ThemeView = () => {
  const { id, provider: providerName } = useParams();
  const { data: theme, isLoading } = useGetThemeByProviderAndId(
    providerName,
    id,
  );

  const provider = isProviderSupported(providerName)
    ? getProviderByName(providerName)
    : undefined;

  return provider && (isLoading || theme) ? (
    <>
      {theme?.title && <Helmet title={theme.title} />}
      <Layout
        rowsSetup="grid-rows-theme-detailed-view items-start"
        responsiveLayout
      >
        <Navbar />
        {isLoading ? (
          <ThemeSkeletonPage />
        ) : (
          <ThemeMobileMenuProvider>
            <AlignmentContextProvider provider={provider}>
              <NavigationPanel theme={theme} />
              <Content theme={theme} />
              <PaginationPanel theme={theme} />
            </AlignmentContextProvider>
          </ThemeMobileMenuProvider>
        )}
        <Footer />
      </Layout>
    </>
  ) : (
    <NotFound />
  );
};

export default ThemeView;
