import React, { useEffect, useState } from 'react';
import Footer from 'src/components/layout/Footer';
import {
  useGetIdFromLocation,
  useGetAnyParamFromLocation,
} from 'src/hooks/useLocationParams';
import {
  useGetVideoWithReferer,
  useGetVideoWithShareCode,
} from 'src/hooks/api/videoQuery';
import { Loading } from 'src/components/common/Loading';
import { Helmet } from 'react-helmet';
import { Layout } from 'src/components/layout/Layout';
import { BoclipsApiError } from 'boclips-api-client/dist/types';
import { VideoPage } from 'src/components/videoPage/VideoPage';
import ErrorView from 'src/views/error/ErrorView';
import UnauthorizedNavbar from 'src/components/layout/UnauthorizedNavbar';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import ShareCodeModal from 'src/components/shareCodeModal/ShareCodeModal';

const UnauthorizedVideoView = () => {
  const videoId = useGetIdFromLocation('shared');
  const referer = useGetAnyParamFromLocation('referer');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [video, setVideo] = useState<Video | undefined>();

  const {
    data: limitedVideo,
    isLoading,
    error,
  } = useGetVideoWithReferer(videoId, referer);

  const { mutate: getVideoWithShareCode, isSuccess } =
    useGetVideoWithShareCode();

  useEffect(() => {
    if (limitedVideo) {
      setVideo(limitedVideo);
    }
  }, [limitedVideo]);

  useEffect(() => {
    if (isSuccess) {
      setIsModalOpen(false);
    }
  }, [isSuccess]);

  if (isLoading) {
    return <Loading />;
  }

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
      <UnauthorizedNavbar />
      {isModalOpen && (
        <ShareCodeModal
          videoId={videoId}
          referer={referer}
          fetchVideoWithCode={getVideoWithShareCode}
        />
      )}
      <VideoPage video={video} />
      <Footer className="row-start-last row-end-last" />
    </Layout>
  );
};

export default UnauthorizedVideoView;
