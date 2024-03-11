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
import { useLocation } from 'react-router-dom';

const UnauthorizedVideoView = () => {
  const location = useLocation();
  const shareCodeReferer = location?.state?.shareCodeReferer || null;
  const videoId = useGetIdFromLocation('shared');
  const referer = useGetAnyParamFromLocation('referer');
  const [code, setCode] = useState<string>(shareCodeReferer?.shareCode);
  const [isModalOpen, setIsModalOpen] = useState(!shareCodeReferer);
  const [video, setVideo] = useState<Video | undefined>();

  useEffect(() => {
    if (shareCodeReferer) {
      setIsModalOpen(false);
      setCode(shareCodeReferer.shareCode);
    }
  }, [shareCodeReferer]);

  const {
    data: limitedVideo,
    isLoading,
    error,
  } = useGetVideoWithReferer(videoId, referer);

  const {
    mutate: getVideoWithShareCode,
    isSuccess,
    isLoading: isVideoLoading,
  } = useGetVideoWithShareCode();

  useEffect(() => {
    if (code) {
      getVideoWithShareCode({ videoId, referer, shareCode: code });
    }
  }, [code]);

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
          assetId={videoId}
          referer={referer}
          fetchAssetWithCode={({ assetId, referer: ref, shareCode }) =>
            setCode(shareCode)
          }
          isFetching={isVideoLoading}
        />
      )}
      <VideoPage video={video} />
      <Footer className="row-start-last row-end-last" />
    </Layout>
  );
};

export default UnauthorizedVideoView;
