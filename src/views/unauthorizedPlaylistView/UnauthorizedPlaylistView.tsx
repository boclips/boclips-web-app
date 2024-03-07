import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import { Layout } from 'src/components/layout/Layout';
import { usePlaylistQuery } from 'src/hooks/api/playlistsQuery';
import { useLocation, useParams } from 'react-router-dom';
import Footer from 'src/components/layout/Footer';
import PlaylistHeader from 'src/components/playlists/playlistHeader/PlaylistHeader';
import PlaylistBody from 'src/components/playlists/PlaylistBody';
import SkeletonPage from 'src/components/skeleton/SkeletonPage';
import { Helmet } from 'react-helmet';
import UnauthorizedNavbar from 'src/components/layout/UnauthorizedNavbar';

const UnauthorizedPlaylistView = () => {
  const { id } = useParams<{ id: string }>();
  const title = useLocation().state?.name || 'Playlist';

  const { data: playlist, isLoading: playlistLoading } = usePlaylistQuery(id);

  return (
    <>
      <Helmet title={title} />
      <Layout rowsSetup="grid-rows-playlist-view" responsiveLayout>
        <UnauthorizedNavbar />
        {playlistLoading ? (
          <SkeletonPage />
        ) : (
          <>
            <PlaylistHeader playlist={playlist} showButtons={false} />
            <PlaylistBody playlist={playlist} showButtons={false} />
          </>
        )}
        <Footer className="col-start-2 col-end-26" />
      </Layout>
    </>
  );
};

export default UnauthorizedPlaylistView;
