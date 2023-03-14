import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { useParams } from 'react-router';
import { useGetThemeByProviderAndId } from 'src/hooks/api/openstaxQuery';
import { Content } from 'src/components/openstax/book/Content';
import { NavigationPanel } from 'src/components/openstax/navigationPanel/NavigationPanel';
import { OpenstaxMobileMenuProvider } from 'src/components/common/providers/OpenstaxMobileMenuProvider';
import OpenstaxBookSkeletonPage from 'src/components/skeleton/openstax/OpenstaxBookSkeletonPage';
import { Helmet } from 'react-helmet';
import PaginationPanel from 'src/components/openstax/book/pagination/PaginationPanel';
import {
  getProviderByName,
  isProviderSupported,
} from 'src/views/openstax/provider/AlignmentProviderFactory';
import NotFound from 'src/views/notFound/NotFound';
import { AlignmentContextProvider } from 'src/components/common/providers/AlignmentContextProvider';

const OpenstaxBookView = () => {
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
        rowsSetup="grid-rows-openstax-detailed-view items-start"
        responsiveLayout
      >
        <Navbar />
        {isLoading ? (
          <OpenstaxBookSkeletonPage />
        ) : (
          <OpenstaxMobileMenuProvider>
            <AlignmentContextProvider provider={provider}>
              <NavigationPanel book={theme} />
              <Content book={theme} />
              <PaginationPanel book={theme} />
            </AlignmentContextProvider>
          </OpenstaxMobileMenuProvider>
        )}
        <Footer />
      </Layout>
    </>
  ) : (
    <NotFound />
  );
};

export default OpenstaxBookView;
