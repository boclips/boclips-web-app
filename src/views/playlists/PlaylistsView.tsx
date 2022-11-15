import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import Playlists from 'src/components/playlists/Playlists';
import { PlaylistsHeader } from 'src/components/libraryHeader/PlaylistsHeader';
import { Helmet } from 'react-helmet';

const PlaylistsView = () => {
  return (
    <>
      <Helmet title="Playlists" />
      <Layout rowsSetup="grid-rows-library-view" responsiveLayout>
        <Navbar />
        <PlaylistsHeader />
        <Playlists />
        <Footer columnPosition="col-start-2 col-end-26" />
      </Layout>
    </>
  );
};

export default PlaylistsView;
