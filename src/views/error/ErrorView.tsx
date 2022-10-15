import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import React from 'react';
import RefreshPageError from 'src/components/common/errors/refreshPageError/RefreshPageError';
import { Layout } from 'src/components/layout/Layout';
import { useLocation } from 'react-router-dom';

const ErrorView = () => {
  const location = useLocation();
  // eslint-disable-next-line no-console
  console.log(location?.state?.error);

  return (
    <Layout rowsSetup="grid-rows-home">
      <Navbar />
      <RefreshPageError />
      <Footer />
    </Layout>
  );
};

export default ErrorView;
