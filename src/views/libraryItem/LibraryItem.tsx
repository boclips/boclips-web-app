import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';

const LibraryItem = () => {
  return (
    <Layout rowsSetup="grid-rows-default-view-with-title" responsiveLayout>
      <Navbar />
      <Footer columnPosition="col-start-2 col-end-26" />
    </Layout>
  );
};

export default LibraryItem;
