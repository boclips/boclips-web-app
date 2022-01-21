import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { FeatureGate } from 'src/components/common/FeatureGate';
import Library from 'src/components/library/Library';

const LibraryView = () => {
  return (
    <Layout rowsSetup="grid-rows-home-responsive" responsiveLayout>
      <Navbar />
      <FeatureGate feature="BO_WEB_APP_ENABLE_PLAYLISTS">
        <Library />
      </FeatureGate>
      <Footer columnPosition="col-start-2 col-end-26" />
    </Layout>
  );
};

export default LibraryView;
