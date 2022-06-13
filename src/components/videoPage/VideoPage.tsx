import React, { useEffect, useRef, useState } from 'react';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { Video } from 'boclips-api-client/dist/types';
import { VideoHeader } from 'src/components/videoPage/VideoHeader';
import { useHistory } from 'react-router-dom';
import BackArrow from 'resources/icons/back-arrow.svg';
import c from 'classnames';
import { TextButton } from 'src/components/common/textButton/TextButton';
import VideoRecommendations from 'src/components/videoPage/VideoRecommendations';
import { FeatureGate } from 'src/components/common/FeatureGate';
import s from './videoPage.module.less';

interface Props {
  video: Video;
}

export const VideoPage = ({ video }: Props) => {
  const history = useHistory();
  const goToPreviousPage = () => {
    history.goBack();
  };
  const ref = useRef(null);
  const [videoPlayerHeight, setVideoPlayerHeight] = useState();

  const userNavigatedToPageViaApp = history.action === 'PUSH';
  const videoMetadataTopMargin = userNavigatedToPageViaApp ? 'lg:mt-8' : '';

  // useEffect(() => {
  //   window.addEventListener('resize', () =>
  //     setVideoPlayerHeight(ref?.current?.firstChild?.clientHeight),
  //   );
  //
  //   return () => {
  //     window.removeEventListener('keydown', () => {});
  //   };
  // }, []);

  // useEffect(() => {
  //   console.log(videoPlayerHeight);
  // }, [videoPlayerHeight]);

  return (
    <>
      {console.log(ref?.current)}
      <main tabIndex={-1} ref={ref} className={s.playerSection}>
        {userNavigatedToPageViaApp && (
          <TextButton
            onClick={goToPreviousPage}
            icon={<BackArrow />}
            text="Back"
          />
        )}
        <VideoPlayer video={video} />
      </main>

      <div
        // style={{ height: ref?.current?.firstChild?.clientHeight || 'auto' }}
        className={c(s.headerSection, videoMetadataTopMargin, 'flex flex-col')}
      >
        <VideoHeader video={video} />
      </div>

      <FeatureGate feature="BO_WEB_APP_VIDEO_RECOMMENDATIONS">
        <VideoRecommendations video={video} />
      </FeatureGate>
    </>
  );
};
