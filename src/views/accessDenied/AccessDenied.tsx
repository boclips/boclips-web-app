import React from 'react';
import Footer from '@src/components/layout/Footer';
import { Layout } from '@src/components/layout/Layout';
import { PageNotFoundError } from '@src/components/common/errors/pageNotFound/PageNotFoundError';
import { EmptyNavbar } from '@src/components/layout/EmptyNavbar';

const AccessDenied = () => {
  return (
    <Layout rowsSetup="grid-rows-home">
      <EmptyNavbar />
      <PageNotFoundError />
      <Footer />
    </Layout>
  );
};

export default AccessDenied;
