import React from 'react';
import Footer from '@components/layout/Footer';
import { Layout } from '@components/layout/Layout';
import { PageNotFoundError } from '@components/common/errors/pageNotFound/PageNotFoundError';
import { EmptyNavbar } from '@components/layout/EmptyNavbar';

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
