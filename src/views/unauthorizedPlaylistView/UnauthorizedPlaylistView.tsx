import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import { useGetPlaylistWithReferer } from 'src/hooks/api/playlistsQuery';
import { useLocation } from 'react-router-dom';
import Footer from 'src/components/layout/Footer';
import SkeletonPage from 'src/components/skeleton/SkeletonPage';
import { Helmet } from 'react-helmet';
import UnauthorizedNavbar from 'src/components/layout/UnauthorizedNavbar';
import {
  useGetAnyParamFromLocation,
  useGetIdFromLocation,
} from 'src/hooks/useLocationParams';
import { PageNotFoundError } from 'src/components/common/errors/pageNotFound/PageNotFoundError';
import PlaylistBody from 'src/components/playlists/playlistBody/PlaylistBody';
import ErrorView from 'src/views/error/ErrorView';
import { BoclipsApiError } from 'boclips-api-client/dist/types/BoclipsApiError';
import { Constants } from 'src/AppConstants';
import UnauthorizedPlaylistHeader from 'src/components/playlists/playlistHeader/UnauthorizedPlaylistHeader';

const UnauthorizedPlaylistView = () => {
  const playlistId = useGetIdFromLocation('shared');
  const title = useLocation().state?.name || 'Playlist';
  const referer = useGetAnyParamFromLocation('referer');

  const {
    data: playlist,
    isFetching,
    isError,
    error,
  } = useGetPlaylistWithReferer(playlistId, referer);

  const isUnauthorized = (error as BoclipsApiError)?.status === 403;
  if (!referer || isUnauthorized) {
    return (
      <>
        <Helmet title={title} />
        <Layout rowsSetup="grid-rows-playlist-view" responsiveLayout>
          <UnauthorizedNavbar />
          <PageNotFoundError />
          <Footer
            className="col-start-2 col-end-26"
            termsAndConditionsLink={
              Constants.CLASSROOM_TERMS_AND_CONDITIONS_LINK
            }
          />
        </Layout>
      </>
    );
  }

  if (isError || (!playlist && !isFetching)) {
    return <ErrorView />;
  }

  return (
    <>
      <Helmet title={title} />
      <Layout rowsSetup="grid-rows-playlist-view" responsiveLayout>
        <UnauthorizedNavbar />
        {isFetching ? (
          <SkeletonPage
            title="playlist skeleton unauthorized"
            animated={false}
          />
        ) : (
          <>
            <UnauthorizedPlaylistHeader playlist={playlist} />
            <PlaylistBody
              playlist={playlist}
              showButtons={false}
              disableLinks
              mode="LIST"
            />
          </>
        )}
        <Footer
          className="col-start-2 col-end-26"
          termsAndConditionsLink={Constants.CLASSROOM_TERMS_AND_CONDITIONS_LINK}
        />
      </Layout>
    </>
  );
};

export default UnauthorizedPlaylistView;
