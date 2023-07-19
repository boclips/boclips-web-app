import React from 'react';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { Video } from 'boclips-api-client/dist/types';
import { useLocation, useNavigate } from 'react-router-dom';
import BackArrow from 'resources/icons/back-arrow.svg';
import { TextButton } from 'src/components/common/textButton/TextButton';
import VideoRecommendations from 'src/components/videoPage/VideoRecommendations';
import { VideoHeaderWithDescription } from 'src/components/videoPage/VideoHeaderWithDescription';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { VideoAIMetadataWrapper } from 'src/components/videoPage/VideoAIMetadataWrapper';
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
        <VideoPlayer video={video} />
      </main>
      <section className={s.headerSection} aria-labelledby="video-title">
        <VideoHeaderWithDescription video={video} />
      </section>
      <FeatureGate feature="BO_WEB_APP_DEV">
        <VideoAIMetadataWrapper videoId={video.id} />
      </FeatureGate>
      <VideoRecommendations video={video} />
    </>
  );
};
