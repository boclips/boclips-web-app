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
import c from 'classnames';
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
      </main>
      <div className={c(s.headerSection, videoMetadataTopMargin)}>
        <VideoHeader video={video} />
      </div>
      <div className={s.descriptionSection}>
        <VideoDescription video={video} />
      </div>
      <div className={s.additionalServicesSection}>
        <FeatureGate feature="BO_WEB_APP_ADDITIONAL_SERVICES">
          <VideoAdditionalServices />
        </FeatureGate>
      </div>
    </>
  );
};
