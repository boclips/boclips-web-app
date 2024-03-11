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
import { GoogleClassroomShareLink } from 'src/components/videoShareButton/googleClassroom/GoogleClassroomShareLink';
import { getShareableVideoLink } from 'src/components/videoShareButton/getShareableLink';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import s from './shareButton.module.less';

interface VideoShareButtonProps {
  iconOnly?: boolean;
  video: Video;
}

export const VideoShareButton = ({
  iconOnly = false,
  video,
}: VideoShareButtonProps) => {
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
    return () => {
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
          footerText={
            <Typography.Body
              as="div"
              className="text-center pt-4 pb-6 text-gray-800"
              data-qa="share-code-footer"
            >
              {`Your unique Teacher code is `}
              <Typography.Body weight="medium">
                {user.shareCode}
              </Typography.Body>
            </Typography.Body>
          }
          extraButton={
            <GoogleClassroomShareLink
              link={shareLink}
              postTitle={video.title}
              postBody={`Use code ${user.shareCode} to view this.`}
              onClick={() => {}}
            />
          }
        >
          <Typography.Body as="div" className="mb-14 text-gray-800">
            Students need both the link and your unique teacher code to access
            and play the video{' '}
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
