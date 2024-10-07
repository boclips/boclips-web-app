import React, { ChangeEvent, useEffect, useState } from 'react';
import ShareSVG from 'src/resources/icons/white-share.svg';
import Button from '@boclips-ui/button';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { Video } from 'boclips-api-client/dist/types';
import CopyLinkIcon from 'src/resources/icons/copy-link-icon.svg';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { DurationInput } from 'src/components/cart/AdditionalServices/Trim/DurationInput';
import BoCheckbox from 'src/components/common/input/BoCheckbox';
import {
  durationInSeconds,
  isTrimFromValid,
  isTrimToValid,
} from 'src/components/cart/AdditionalServices/Trim/trimValidation';
import { Typography } from '@boclips-ui/typography';
import { GoogleClassroomShareLink } from 'src/components/shareCodeButton/googleClassroom/GoogleClassroomShareLink';
import { getShareableVideoLink } from 'src/components/shareCodeButton/getShareableLink';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import s from './shareCodeButton.module.less';

interface VideoShareCodeButtonProps {
  iconOnly?: boolean;
  video: Video;
}

export const VideoShareCodeButton = ({
  iconOnly = false,
  video,
}: VideoShareCodeButtonProps) => {
  const client = useBoclipsClient();

  const { data: user } = useGetUserQuery();
  const videoDuration = video.playback.duration.format('mm:ss');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startTimeEnabled, setStartTimeEnabled] = useState(false);
  const [startDuration, setStartDuration] = useState('00:00');
  const [startDurationValid, setStartDurationValid] = useState(true);

  const [endTimeEnabled, setEndTimeEnabled] = useState(false);
  const [endDuration, setEndDuration] = useState(videoDuration);
  const [endDurationValid, setEndDurationValid] = useState(true);

  const shareLink = getShareableVideoLink(
    video.id,
    user?.id,
    durationInSeconds(startDuration),
    durationInSeconds(endDuration),
  );

  const toggleModalVisibility = () => setIsModalVisible(!isModalVisible);

  useEffect(() => {
    if (startDuration.length === 5) validateFields();
    if (endDuration.length === 5) validateFields();
  }, [startDuration, endDuration]);

  useEffect(() => {
    const main = document.querySelector('main');

    if (isModalVisible && main) {
      main.removeAttribute('tabIndex');
    }

    return () => {
      if (main) main.setAttribute('tabIndex', '-1');

      setStartTimeEnabled(false);
      setStartDuration('00:00');
      setStartDurationValid(true);
      setEndTimeEnabled(false);
      setEndDuration('00:00');
      setEndDurationValid(true);
    };
  }, [isModalVisible]);

  const handleStartTimeChange = (value: string) => {
    setStartDuration(value);
  };

  const handleEndTimeChange = (value: string) => {
    setEndDuration(value);
  };

  const validateFields = () => {
    if (startTimeEnabled) {
      setStartDurationValid(
        isTrimFromValid(
          { from: startDuration, to: endDuration },
          video.playback.duration,
        ),
      );
    }

    if (endTimeEnabled) {
      setEndDurationValid(
        isTrimToValid(
          { from: startDuration, to: endDuration },
          video.playback.duration,
        ),
      );
    }
  };

  const handleCopyLink = () => {
    if (!startDurationValid || !endDurationValid) {
      return;
    }
    client.shareCodes.trackVideoShareCode(video.id);

    navigator.clipboard.writeText(shareLink).then(() => {
      displayNotification(
        'success',
        'Share link copied!',
        '',
        'text-copied-notification',
      );
    });
  };

  return (
    <>
      <Button
        onClick={toggleModalVisibility}
        dataQa="share-button"
        text="Share"
        aria-label="Share"
        icon={<ShareSVG />}
        height="40px"
        className={s.shareButton}
        iconOnly={iconOnly}
      />
      {isModalVisible && (
        <Bodal
          onCancel={toggleModalVisibility}
          title="Share this video with students"
          displayCancelButton={false}
          confirmButtonText="Copy link"
          confirmButtonIcon={<CopyLinkIcon />}
          footerClass={s.bodalButtons}
          onConfirm={handleCopyLink}
          smallSize={false}
          extraButton={
            <GoogleClassroomShareLink
              link={shareLink}
              postTitle={video.title}
              onClick={() => {}}
            />
          }
        >
          <Typography.Body
            as="div"
            className="mb-14 text-gray-800"
            data-qa="share-code-body"
          >
            Students only need the link to access and play the video{' '}
            <Typography.Body weight="medium">{video.title}</Typography.Body>
          </Typography.Body>
          <div className="flex justify-center mb-10">
            <div className="flex items-center">
              <BoCheckbox
                checked={startTimeEnabled}
                id="start-time-checkbox"
                name="Start time enabled"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setStartTimeEnabled(e.currentTarget.checked)
                }
                showLabel={false}
              />
              <DurationInput
                label="Start time:"
                value={startDuration}
                id="start-time"
                disabled={!startTimeEnabled}
                onChange={handleStartTimeChange}
                isError={!startDurationValid}
              />
            </div>
            <div className="flex items-center ml-16">
              <BoCheckbox
                aria-label="end time enabled"
                checked={endTimeEnabled}
                id="end-time-checkbox"
                name="End time enabled"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEndTimeEnabled(e.currentTarget.checked)
                }
                showLabel={false}
              />
              <DurationInput
                label="End time:"
                value={endDuration}
                id="end-time"
                disabled={!endTimeEnabled}
                onChange={handleEndTimeChange}
                isError={!endDurationValid}
                onBlur={validateFields}
                placeholder={videoDuration}
              />
            </div>
          </div>
          {(!startDurationValid || !endDurationValid) && (
            <Typography.Body
              as="div"
              className="flex justify-center mt-4 text-red-error"
            >
              Please enter valid start and end times
            </Typography.Body>
          )}
        </Bodal>
      )}
    </>
  );
};
