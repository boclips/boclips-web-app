import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import {
  useGetIdFromLocation,
  useGetAnyParamFromLocation,
} from 'src/hooks/useLocationParams';
import { useGetVideoWithShareCode } from 'src/hooks/api/videoQuery';
import { Loading } from 'src/components/common/Loading';
import { Helmet } from 'react-helmet';
import { Layout } from 'src/components/layout/Layout';
import { BoclipsApiError } from 'boclips-api-client/dist/types';
import { VideoPage } from 'src/components/videoPage/VideoPage';
import ErrorView from 'src/views/error/ErrorView';

const UnauthorizedVideoView = () => {
  const videoId = useGetIdFromLocation('shared');
  const referer = useGetAnyParamFromLocation('referer');

  const {
    data: video,
    isLoading,
    error,
  } = useGetVideoWithShareCode(videoId, referer);

  if (isLoading) return <Loading />;

  const isVideoNotFound = (error as BoclipsApiError)?.status === 404;

  if (isVideoNotFound || !video) {
    return <ErrorView />;
  }

  return (
    <Layout
      dataQa="video-page"
      rowsSetup="lg:grid-rows-large-screen-video-view grid-rows-video-view auto-rows-min"
      responsiveLayout
    >
      {video?.title && <Helmet title={video.title} />}
      <Navbar showOptions={false} showSearch={false} />
      <VideoPage video={video} />
      <Footer className="row-start-last row-end-last" />
    </Layout>
  );
};

export default UnauthorizedVideoView;
