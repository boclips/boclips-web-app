import React from 'react';
import Footer from 'src/components/layout/Footer';
import {
  useGetAnyParamFromLocation,
  useGetIdFromLocation,
  useGetNumberParamFromLocation,
} from 'src/hooks/useLocationParams';
import { useGetVideoWithReferer } from 'src/hooks/api/videoQuery';
import { Loading } from 'src/components/common/Loading';
import { Helmet } from 'react-helmet';
import { Layout } from 'src/components/layout/Layout';
import { VideoPage } from 'src/components/videoPage/VideoPage';
import ErrorView from 'src/views/error/ErrorView';
import UnauthorizedNavbar from 'src/components/layout/UnauthorizedNavbar';
import { PageNotFoundError } from 'src/components/common/errors/pageNotFound/PageNotFoundError';
import { BoclipsApiError } from 'boclips-api-client/dist/types/BoclipsApiError';

const UnauthorizedVideoView = () => {
  const videoId = useGetIdFromLocation('shared');
  const referer = useGetAnyParamFromLocation('referer');
  const start = useGetNumberParamFromLocation('segmentStart');
  const end = useGetNumberParamFromLocation('segmentEnd');

  const {
    data: video,
    isFetching,
    isError,
    error,
  } = useGetVideoWithReferer(videoId, referer);

  if (isFetching) {
    return <Loading />;
  }

  const isVideoNotFound = (error as BoclipsApiError)?.status === 404;

  if (!referer || isVideoNotFound) {
    return (
      <>
        <Helmet title="Shared Video" />
        <Layout
          rowsSetup="lg:grid-rows-large-screen-video-view grid-rows-video-view auto-rows-min"
          responsiveLayout
        >
          <UnauthorizedNavbar />
          <PageNotFoundError />
          <Footer className="row-start-last row-end-last" />
        </Layout>
      </>
    );
  }

  if (isError || !video) {
    return <ErrorView />;
  }

  return (
    <Layout
      dataQa="video-page"
      rowsSetup="lg:grid-rows-large-screen-video-view grid-rows-video-view auto-rows-min"
      responsiveLayout
    >
      {video?.title && <Helmet title={video.title} />}
      <UnauthorizedNavbar />
      <VideoPage video={video} start={start} end={end} />
      <Footer className="row-start-last row-end-last" />
    </Layout>
  );
};

export default UnauthorizedVideoView;
