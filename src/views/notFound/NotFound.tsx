import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { PageNotFoundError } from 'src/components/common/errors/pageNotFound/PageNotFoundError';
import UnauthorizedNavbar from 'src/components/layout/UnauthorizedNavbar';

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
