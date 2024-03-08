import React, { useEffect, useState } from 'react';
import { Layout } from 'src/components/layout/Layout';
import { useGetPlaylistWithShareCode } from 'src/hooks/api/playlistsQuery';
import { useLocation } from 'react-router-dom';
import Footer from 'src/components/layout/Footer';
import PlaylistHeader from 'src/components/playlists/playlistHeader/PlaylistHeader';
import SkeletonPage from 'src/components/skeleton/SkeletonPage';
import { Helmet } from 'react-helmet';
import UnauthorizedNavbar from 'src/components/layout/UnauthorizedNavbar';
import ShareCodeModal from 'src/components/shareCodeModal/ShareCodeModal';
import {
  useGetAnyParamFromLocation,
  useGetIdFromLocation,
} from 'src/hooks/useLocationParams';
import { PageNotFoundError } from 'src/components/common/errors/pageNotFound/PageNotFoundError';
import PlaylistBody from 'src/components/playlists/playlistBody/PlaylistBody';

const UnauthorizedPlaylistView = () => {
  const playlistId = useGetIdFromLocation('shared');
  const title = useLocation().state?.name || 'Playlist';
  const referer = useGetAnyParamFromLocation('referer');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [code, setCode] = useState(null);

  const {
    data: playlist,
    isSuccess,
    isFetching,
    refetch: getPlaylistWithShareCode,
  } = useGetPlaylistWithShareCode(playlistId, referer, code);

  useEffect(() => {
    if (code) {
      getPlaylistWithShareCode().then();
    }
  }, [code]);

  useEffect(() => {
    if (isSuccess) {
      setIsModalOpen(false);
    }
  }, [isSuccess]);

  if (!referer) {
    return (
      <>
        <Helmet title={title} />
        <Layout rowsSetup="grid-rows-playlist-view" responsiveLayout>
          <UnauthorizedNavbar />
          <PageNotFoundError />
          <Footer className="col-start-2 col-end-26" />
        </Layout>
      </>
    );
  }

  return (
    <>
      <Helmet title={title} />
      <Layout rowsSetup="grid-rows-playlist-view" responsiveLayout>
        <UnauthorizedNavbar />
        {isModalOpen && (
          <ShareCodeModal
            assetId={playlistId}
            referer={referer}
            fetchAssetWithCode={({ shareCode }) => {
              setCode(shareCode);
            }}
            isFetching={isFetching}
          />
        )}
        {!playlist ? (
          <SkeletonPage title="playlist skeleton unauthorized" />
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
