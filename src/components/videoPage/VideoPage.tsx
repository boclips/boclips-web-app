import React from 'react';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { VideoDescription } from 'src/components/videoPage/VideoDescription';
import { Video } from 'boclips-api-client/dist/types';
import { VideoAdditionalServices } from 'src/components/videoPage/VideoAdditionalServices';
import { VideoHeader } from 'src/components/videoPage/VideoHeader';
import { useHistory } from 'react-router-dom';
import BackArrow from 'resources/icons/back-arrow.svg';
import { FeatureGate } from 'src/components/common/FeatureGate';

interface Props {
  video: Video;
}

export const VideoPage = ({ video }: Props) => {
  const history: any = useHistory();
  const goToPreviousPage = () => {
    history.goBack();
  };

  const userNavigatedToPageViaApp = history.action === 'PUSH';
  const videoMetadataTopMargin = userNavigatedToPageViaApp ? 'mt-8' : '';

  return (
    <>
      <div className="col-start-2 col-end-18 row-start-2 row-end-2 h-full">
        {userNavigatedToPageViaApp && (
          <button
            type="button"
            className="text-blue-800 text-base font-xs font-medium flex flex-row items-center mb-4"
            onClick={goToPreviousPage}
          >
            <BackArrow className="mr-4" />
            Back
          </button>
        )}

        <VideoPlayer video={video} />
        <VideoDescription video={video} />
      </div>

      <div
        className={`col-start-18 col-end-26 row-start-2 row-end-2 ${videoMetadataTopMargin}`}
      >
        <VideoHeader video={video} />
        <FeatureGate feature="BO_WEB_APP_ADDITIONAL_SERVICES">
          <VideoAdditionalServices />
        </FeatureGate>
      </div>
    </>
  );
};
