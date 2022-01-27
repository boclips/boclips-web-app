import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { FeatureGate } from 'src/components/common/FeatureGate';
import PageTitle from 'src/components/pageTitle/PageTitle';
import Playlists from 'src/components/playlists/Playlists';

const LibraryView = () => {
  return (
    <Layout rowsSetup="grid-rows-default-view-with-title" responsiveLayout>
      <Navbar />
      <FeatureGate feature="BO_WEB_APP_ENABLE_PLAYLISTS">
        <PageTitle title="Your Library" />
        <Playlists />
      </FeatureGate>
      <Footer columnPosition="col-start-2 col-end-26" />
    </Layout>
  );
};

export default LibraryView;
