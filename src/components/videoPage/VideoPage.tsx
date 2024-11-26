import React from 'react';
import { Video } from 'boclips-api-client/dist/types';
import { useLocation, useNavigate } from 'react-router-dom';
import BackArrow from '@resources/icons/back-arrow.svg';
import { TextButton } from '@components/common/textButton/TextButton';
import { VideoHeader } from '@components/videoPage/VideoHeader';
import VideoRecommendations from '@components/videoPage/VideoRecommendations';
import VideoAiMetadata from '@components/videoPage/videoMetadata/ai/VideoAiMetadata';
import VideoDescription from '@components/videoPage/videoMetadata/VideoDescription';
import { VideoPlayer } from '@components/videoCard/VideoPlayer';
import { UnauthorizedVideoHeader } from '@components/videoPage/UnauthorizedVideoHeader';
import s from './videoPage.module.less';

interface Props {
  video: Video;
  start?: number;
  end?: number;
  skipMetadataAndRecommendations?: boolean;
  isAuthenticated?: boolean;
}

export const VideoPage = ({
  video,
  start = null,
  end = null,
  skipMetadataAndRecommendations = false,
  isAuthenticated = true,
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
        {isAuthenticated ? (
          <VideoHeader video={video} />
        ) : (
          <UnauthorizedVideoHeader video={video} />
        )}
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
