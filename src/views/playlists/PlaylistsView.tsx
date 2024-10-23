import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import Playlists from 'src/components/playlists/Playlists';
import { Helmet } from 'react-helmet';
import PageHeader from 'src/components/pageTitle/PageHeader';
import CreateNewPlaylistButton from 'src/components/playlists/buttons/createPlaylist/CreateNewPlaylistButton';

const PlaylistsView = () => {
  return (
    <>
      <Helmet title="Playlists" />
      <Layout rowsSetup="grid-rows-library-view" responsiveLayout>
        <Navbar />
        <PageHeader
          title="Playlists"
          button={<CreateNewPlaylistButton />}
          description="Create, search and share your own video playlists, as well as
          playlists that have been shared with you by your friends or
          colleagues, and featured playlists that have been curated by Boclips."
        />
        <Playlists />
        <Footer className="col-start-2 col-end-26" />
      </Layout>
    </>
  );
};

export default PlaylistsView;
