import React from 'react';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import { Layout } from '@components/layout/Layout';
import { PageNotFoundError } from '@components/common/errors/pageNotFound/PageNotFoundError';
import UnauthorizedNavbar from '@components/layout/UnauthorizedNavbar';

interface Props {
  unauthenticated?: boolean;
}

const NotFound = ({ unauthenticated = false }: Props) => {
  return (
    <Layout rowsSetup="grid-rows-home">
      {unauthenticated ? <UnauthorizedNavbar /> : <Navbar />}
      <PageNotFoundError />
      <Footer />
    </Layout>
  );
};

export default NotFound;
