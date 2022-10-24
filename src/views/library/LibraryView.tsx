import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import Playlists from 'src/components/playlists/Playlists';
import { LibraryHeader } from 'src/components/libraryHeader/LibraryHeader';
import { Helmet } from 'react-helmet';

const LibraryView = () => {
  return (
    <>
      <Helmet title="Your library" />
      <Layout rowsSetup="grid-rows-library-view" responsiveLayout>
        <Navbar />
        <LibraryHeader />
        <Playlists />
        <Footer columnPosition="col-start-2 col-end-26" />
      </Layout>
    </>
  );
};

export default LibraryView;
