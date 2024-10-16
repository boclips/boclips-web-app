import React from 'react';
import { Video } from 'boclips-api-client/dist/types';
import { useLocation, useNavigate } from 'react-router-dom';
import BackArrow from 'resources/icons/back-arrow.svg';
import { TextButton } from 'src/components/common/textButton/TextButton';
import { VideoHeader } from 'src/components/videoPage/VideoHeader';
import VideoRecommendations from 'src/components/videoPage/VideoRecommendations';
import VideoAiMetadata from 'src/components/videoPage/videoMetadata/ai/VideoAiMetadata';
import VideoDescription from 'src/components/videoPage/videoMetadata/VideoDescription';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import s from './videoPage.module.less';

interface Props {
  video: Video;
  start?: number;
  end?: number;
  skipMetadataAndRecommendations?: boolean;
}

export const VideoPage = ({
  video,
  start = null,
  end = null,
  skipMetadataAndRecommendations = false,
}: Props) => {
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
          <VideoPlayer video={video} segment={{ start, end }} />
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
      {!skipMetadataAndRecommendations && (
        <>
          <VideoAiMetadata video={video} />
          <VideoRecommendations video={video} />
        </>
      )}
    </>
  );
};
