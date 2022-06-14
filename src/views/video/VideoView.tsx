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
import { BoclipsApiError } from 'boclips-api-client/dist/types';
import { Fallback } from 'src/views/video/Fallback';
import useFeatureFlags from 'src/hooks/useFeatureFlags';
import { VideoPageWithRecommendations } from 'src/components/videoPage/VideoPageWithRecommendations';

const VideoView = () => {
  const videoId = useGetIdFromLocation('videos');
  const { data: video, isLoading, error } = useFindOrGetVideo(videoId);

  const flags = useFeatureFlags();
  const isWithRecommendations = flags && flags.BO_WEB_APP_VIDEO_RECOMMENDATIONS;

  if (isLoading && !video) return <Loading />;

  const isVideoNotFound = (error as BoclipsApiError)?.status === 404;

  return (
    <Layout
      dataQa="video-page"
      rowsSetup="grid-rows-video-view auto-rows-min"
      responsiveLayout
    >
      {video?.title && <Helmet title={video.title} />}
      <Navbar />
      <ErrorBoundary fallback={<Fallback isVideoNotFound={isVideoNotFound} />}>
        {isWithRecommendations ? (
          <VideoPageWithRecommendations video={video} />
        ) : (
          <VideoPage video={video} />
        )}
      </ErrorBoundary>
      <Footer />
    </Layout>
  );
};

export default VideoView;
