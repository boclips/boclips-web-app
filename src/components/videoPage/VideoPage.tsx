import React from 'react';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { Video } from 'boclips-api-client/dist/types';
import { useHistory } from 'react-router-dom';
import BackArrow from 'resources/icons/back-arrow.svg';
import c from 'classnames';
import { TextButton } from 'src/components/common/textButton/TextButton';
import VideoRecommendations from 'src/components/videoPage/VideoRecommendations';
import { VideoHeaderWithDescription } from 'src/components/videoPage/VideoHeaderWithDescription';
import s from './videoPage.module.less';

interface Props {
  video: Video;
}

export const VideoPage = ({ video }: Props) => {
  const history = useHistory();

  const goToPreviousPage = () => {
    history.goBack();
  };

  const userNavigatedToPageViaApp = history.action === 'PUSH';
  const videoMetadataTopMargin = userNavigatedToPageViaApp ? 'lg:mt-8' : '';

  return (
    <>
      <main tabIndex={-1} className={s.playerSection}>
        {userNavigatedToPageViaApp && (
          <TextButton
            onClick={goToPreviousPage}
            icon={<BackArrow />}
            text="Back"
          />
        )}
        <VideoPlayer video={video} />
      </main>

      <section
        className={c(s.headerSection, videoMetadataTopMargin, 'flex flex-col')}
        aria-labelledby="video-title"
      >
        <VideoHeaderWithDescription video={video} />
      </section>
      <VideoRecommendations video={video} />
    </>
  );
};
