import React from 'react';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { VideoDescription } from 'src/components/videoPage/VideoDescription';
import { Video } from 'boclips-api-client/dist/types';
import { VideoAdditionalServices } from 'src/components/videoPage/VideoAdditionalServices';
import { VideoHeader } from 'src/components/videoPage/VideoHeader';
import { useHistory } from 'react-router-dom';
import BackArrow from 'resources/icons/back-arrow.svg';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { Typography } from '@boclips-ui/typography';

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
      <main
        tabIndex={-1}
        className="col-start-2 col-end-26 row-start-2 h-full lg:col-start-2 lg:col-end-18 lg:row-end-6"
      >
        {userNavigatedToPageViaApp && (
          <button
            type="button"
            className="text-blue-800 flex flex-row items-center mb-4"
            onClick={goToPreviousPage}
          >
            <BackArrow className="mr-4" />
            <Typography.Body size="small" weight="medium">
              Back
            </Typography.Body>
          </button>
        )}

        <VideoPlayer video={video} />

        {/* Hide the video description on smaller screens,
        so it can be placed between header and additional services on tablet/mobile  */}
        <div className="hidden lg:block">
          <VideoDescription video={video} />
        </div>
      </main>
      <div
        className={`col-start-2 col-end-26 row-start-3 row-end-3 ${videoMetadataTopMargin} lg:col-start-18 lg:col-end-26 lg:row-start-auto lg:row-end-auto`}
      >
        <VideoHeader video={video} />
      </div>
      <div className="col-start-2 col-end-26 row-start-4 row-end-4 -mt-2 lg:hidden">
        <VideoDescription video={video} />
      </div>
      <div className="col-start-2 col-end-26 row-start-5 row-end-5 -mt-6 lg:col-start-18 lg:col-end-26 lg:row-start-auto lg:row-end-auto">
        <FeatureGate feature="BO_WEB_APP_ADDITIONAL_SERVICES">
          <VideoAdditionalServices />
        </FeatureGate>
      </div>
    </>
  );
};
