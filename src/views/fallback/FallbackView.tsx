import React from 'react';
import RefreshPageError from '@components/common/errors/refreshPageError/RefreshPageError';
import Footer from '@components/layout/Footer';
import { Layout } from '@components/layout/Layout';
import { EmptyNavbar } from '@components/layout/EmptyNavbar';

const FallbackView = () => {
  return (
    <Layout rowsSetup="grid-rows-search-view">
      <EmptyNavbar />
      <RefreshPageError />
      <Footer />
    </Layout>
  );
};

export default FallbackView;
