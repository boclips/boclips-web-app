import React, { useEffect } from 'react';
import Navbar from 'src/components/layout/Navbar';
import { Layout } from 'src/components/layout/Layout';
import { usePlaylistQuery } from 'src/hooks/api/playlistsQuery';
import { useLocation, useParams } from 'react-router-dom';
import Footer from 'src/components/layout/Footer';
import PlaylistHeader from 'src/components/playlists/playlistHeader/PlaylistHeader';
import PlaylistBody from 'src/components/playlists/playlistBody/PlaylistBody';
import SkeletonPage from 'src/components/skeleton/SkeletonPage';
import { FollowPlaylist } from 'src/services/followPlaylist';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { Helmet } from 'react-helmet';

interface Props {
  followPlaylist: FollowPlaylist;
}

const PlaylistView = ({ followPlaylist }: Props) => {
  const { id } = useParams<{ id: string }>();
  const title = useLocation().state?.name || 'Playlist';

  const {
    data: playlist,
    isLoading: playlistLoading,
    remove,
  } = usePlaylistQuery(id);

  useEffect(() => {
    if (playlist) {
      followPlaylist
        .follow(playlist)
        .then((hasBeenBookmarked) => {
          if (hasBeenBookmarked) {
            displayNotification(
              'success',
              `Playlist '${playlist.title}' has been created`,
              '',
              `playlist-has-been-followed`,
            );
            remove();
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
    <>
      <Helmet title={title} />
      <Layout rowsSetup="grid-rows-playlist-view" responsiveLayout>
        <Navbar />
        {playlistLoading ? (
          <SkeletonPage />
        ) : (
          <>
            <PlaylistHeader playlist={playlist} />
            <PlaylistBody playlist={playlist} />
          </>
        )}
        <Footer className="col-start-2 col-end-26 row-start-5" />
      </Layout>
    </>
  );
};

export default PlaylistView;
