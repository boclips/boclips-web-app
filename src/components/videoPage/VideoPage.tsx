import React from 'react';
import { Video } from 'boclips-api-client/dist/types';
import { useLocation, useNavigate } from 'react-router-dom';
import BackArrow from 'resources/icons/back-arrow.svg';
import { TextButton } from 'src/components/common/textButton/TextButton';
import { VideoHeader } from 'src/components/videoPage/VideoHeader';
import VideoRecommendations from 'src/components/videoPage/VideoRecommendations';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import VideoAiMetadata from 'src/components/videoPage/videoMetadata/ai/VideoAiMetadata';
import VideoDescription from 'src/components/videoPage/videoMetadata/VideoDescription';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import s from './videoPage.module.less';

interface Props {
  video: Video;
}

export const VideoPage = ({ video }: Props) => {
  const navigate = useNavigate();
  const userNavigatedToPageViaApp = useLocation().state?.userNavigated;

  const goToPreviousPage = () => {
    navigate(-1);
  };

  return (
    <>
      {userNavigatedToPageViaApp && (
        <div className={s.backButton}>
          <TextButton
            onClick={goToPreviousPage}
            icon={<BackArrow />}
            text="Back"
          />
        </div>
      )}
      <main tabIndex={-1} className={s.playerSection}>
        {video?.playback?.links?.hlsStream?.getOriginalLink() ? (
          <VideoPlayer video={video} />
        ) : (
          <img
            src={video.playback.links.thumbnail.getOriginalLink()}
            width="100%"
            alt={`${video.title} thumbnail`}
          />
        )}
      </main>
      <section className={s.headerSection} aria-labelledby="video-title">
        <VideoHeader video={video} />
      </section>

      <VideoDescription video={video} />

      <FeatureGate product={Product.B2B} fallback={null}>
        <VideoAiMetadata video={video} />
      </FeatureGate>

      <FeatureGate product={Product.B2B} fallback={null}>
        <VideoRecommendations video={video} />
      </FeatureGate>
    </>
  );
};
