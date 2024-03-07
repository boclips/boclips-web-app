import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { useGetIdFromLocation } from 'src/hooks/useLocationParams';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import { Loading } from 'src/components/common/Loading';
import { Helmet } from 'react-helmet';
import { Layout } from 'src/components/layout/Layout';
import { ErrorBoundary } from 'src/components/common/errors/ErrorBoundary';
import { BoclipsApiError } from 'boclips-api-client/dist/types';
import { Fallback } from 'src/views/video/Fallback';
import { VideoPage } from 'src/components/videoPage/VideoPage';

const VideoView = () => {
  const videoId = useGetIdFromLocation('videos');
  const { data: video, isInitialLoading, error } = useFindOrGetVideo(videoId);

  if (isInitialLoading) return <Loading />;

  const isVideoNotFound = (error as BoclipsApiError)?.status === 404;

  return (
    <Layout
      dataQa="video-page"
      rowsSetup="lg:grid-rows-large-screen-video-view grid-rows-video-view auto-rows-min"
      responsiveLayout
    >
      {video?.title && <Helmet title={video.title} />}
      <Navbar />
      <ErrorBoundary fallback={<Fallback isVideoNotFound={isVideoNotFound} />}>
        <VideoPage video={video} />
      </ErrorBoundary>
      <Footer className="row-start-last row-end-last" />
    </Layout>
  );
};

export default VideoView;
