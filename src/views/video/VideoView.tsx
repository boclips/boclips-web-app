import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { VideoPage } from 'src/components/videoPage/VideoPage';
import { useGetIdFromLocation } from 'src/hooks/useLocationParams';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import { Loading } from 'src/components/common/Loading';
import { Helmet } from 'react-helmet';
import { Layout } from 'src/components/layout/Layout';
import { ErrorBoundary } from 'src/components/common/errors/ErrorBoundary';
import RefreshPageError from 'src/components/common/errors/refreshPageError/RefreshPageError';
import { BoclipsApiError } from 'boclips-api-client/dist/types';
import { PageNotFoundError } from 'src/components/common/errors/pageNotFound/PageNotFoundError';

const VideoView = () => {
  const videoId = useGetIdFromLocation('videos');
  const { data: video, isLoading, error } = useFindOrGetVideo(videoId);

  // TODO: FIX INFINITE LOADING IF ERROR

  if (isLoading && !video) return <Loading />;

  const isVideoNotFound = (error as BoclipsApiError)?.status === 404;

  return (
    <Layout dataQa="video-page" rowsSetup="grid-rows-default-view">
      {video?.title && <Helmet title={video.title} />}
      <Navbar />
      <ErrorBoundary
        fallback={
          isVideoNotFound ? <PageNotFoundError /> : <RefreshPageError />
        }
      >
        <VideoPage video={video} />
      </ErrorBoundary>
      <Footer />
    </Layout>
  );
};

export default VideoView;
