import React from 'react';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { Video } from 'boclips-api-client/dist/types';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const userNavigatedToPageViaApp = useLocation().state?.userNavigated;

  const goToPreviousPage = () => {
    navigate(-1);
  };

  return (
    <>
      {userNavigatedToPageViaApp && (
        <div
          className={c('col-start-2 col-end-26', {
            'row-start-2 row-end-2': userNavigatedToPageViaApp,
          })}
        >
          <TextButton
            onClick={goToPreviousPage}
            icon={<BackArrow />}
            text="Back"
          />
        </div>
      )}
      <main
        tabIndex={-1}
        className={c(s.playerSection, {
          '!row-start-3': userNavigatedToPageViaApp,
        })}
      >
        <VideoPlayer video={video} />
      </main>
      <section
        className={c(
          s.headerSection,
          {
            '!row-start-3': userNavigatedToPageViaApp,
          },
          'flex flex-col',
        )}
        aria-labelledby="video-title"
      >
        <VideoHeaderWithDescription video={video} />
      </section>
      <VideoRecommendations video={video} />
    </>
  );
};
