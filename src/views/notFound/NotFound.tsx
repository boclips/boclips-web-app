import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { PageNotFoundError } from 'src/components/common/errors/pageNotFound/PageNotFoundError';

const NotFound = () => {
  return (
    <Layout rowsSetup="grid-rows-home">
      <Navbar />
      <PageNotFoundError />
      <Footer />
    </Layout>
  );
};

export default NotFound;
