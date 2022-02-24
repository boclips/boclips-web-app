import React, { useEffect } from 'react';
import Navbar from 'src/components/layout/Navbar';
import { Layout } from 'src/components/layout/Layout';
import { usePlaylistQuery } from 'src/hooks/api/playlistsQuery';
import { useParams } from 'react-router-dom';
import { FeatureGate } from 'src/components/common/FeatureGate';
import Footer from 'src/components/layout/Footer';
import PlaylistHeader from 'src/components/playlists/PlaylistHeader';
import PlaylistBody from 'src/components/playlists/PlaylistBody';
import SkeletonPage from 'src/components/skeleton/SkeletonPage';
import { FollowPlaylist } from 'src/services/followPlaylist';
import { displayNotification } from 'src/components/common/notification/displayNotification';

interface Props {
  followPlaylist: FollowPlaylist;
}

const PlaylistView = ({ followPlaylist }: Props) => {
  const { id } = useParams<{ id: string }>();
  const { data: playlist, isLoading: playlistLoading } = usePlaylistQuery(id);

  useEffect(() => {
    if (playlist) {
      followPlaylist
        .follow(playlist)
        .then((hasBeenBookmarked) => {
          if (hasBeenBookmarked) {
            displayNotification(
              'success',
              `Playlist '${playlist.title}' has been added to your Library`,
              '',
              `playlist-has-been-followed`,
            );
          }
        })
        .catch(() => {
          displayNotification(
            'error',
            `Playlist '${playlist.title}' could not be added`,
            '',
            `playlist-has-not-been-followed`,
          );
        });
    }
  }, [followPlaylist, playlist]);

  return (
    <Layout rowsSetup="grid-rows-playlist-view" responsiveLayout>
      <Navbar />
      <FeatureGate feature="BO_WEB_APP_ENABLE_PLAYLISTS">
        {playlistLoading ? (
          <SkeletonPage />
        ) : (
          <>
            <PlaylistHeader playlist={playlist} />
            <PlaylistBody videos={playlist.videos} />
          </>
        )}
      </FeatureGate>
      <Footer columnPosition="col-start-2 col-end-26" />
    </Layout>
  );
};

export default PlaylistView;
