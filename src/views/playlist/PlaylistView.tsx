import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import { Layout } from 'src/components/layout/Layout';
import { usePlaylistQuery } from 'src/hooks/api/playlistsQuery';
import { useParams } from 'react-router-dom';
import { FeatureGate } from 'src/components/common/FeatureGate';
import Footer from 'src/components/layout/Footer';
import PlaylistHeader from 'src/components/playlists/PlaylistHeader';
import PlaylistDescription from 'src/components/playlists/PlaylistDescription';
import PlaylistBody from 'src/components/playlists/PlaylistBody';
import SkeletonPage from 'src/components/skeleton/SkeletonPage';

const PlaylistView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: playlist, isLoading: playlistLoading } = usePlaylistQuery(id);

  return (
    <Layout rowsSetup="grid-rows-playlist-view" responsiveLayout>
      <Navbar />
      <FeatureGate feature="BO_WEB_APP_ENABLE_PLAYLISTS">
        {playlistLoading ? (
          <SkeletonPage />
        ) : (
          <>
            <PlaylistHeader title={playlist.title} />
            {playlist.description && (
              <PlaylistDescription description={playlist.description} />
            )}
            <PlaylistBody videos={playlist.videos} />
          </>
        )}
      </FeatureGate>
      <Footer columnPosition="col-start-2 col-end-26" />
    </Layout>
  );
};

export default PlaylistView;
