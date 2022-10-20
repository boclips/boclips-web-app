import React from 'react';
import RefreshPageError from 'src/components/common/errors/refreshPageError/RefreshPageError';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { EmptyNavbar } from 'src/components/layout/EmptyNavbar';
import { useLocation } from 'react-router-dom';

const FallbackView = () => {
  const location = useLocation();
  // eslint-disable-next-line no-console
  console.log(location?.state?.error);

  return (
    <Layout rowsSetup="grid-rows-search-view">
      <EmptyNavbar />
      <RefreshPageError />
      <Footer />
    </Layout>
  );
};

export default FallbackView;
