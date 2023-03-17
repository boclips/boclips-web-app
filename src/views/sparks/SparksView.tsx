import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import { Layout } from 'src/components/layout/Layout';
import Footer from 'src/components/layout/Footer';
import { SparksWidget } from 'src/components/sparks/menu/SparksWidget';

const SparksView = () => {
  return (
    <Layout rowsSetup="grid-rows-homepage" responsiveLayout>
      <Navbar />
      <SparksWidget />
      <Footer className="col-start-2 col-end-26" />
    </Layout>
  );
};

export default SparksView;
