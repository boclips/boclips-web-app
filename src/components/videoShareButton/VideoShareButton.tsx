import React, { ChangeEvent, useState } from 'react';
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
import { getShareableVideoLink } from 'src/components/videoShareButton/getShareableVideoLink';
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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startTimeEnabled, setStartTimeEnabled] = useState(false);
  const [startDuration, setStartDuration] = useState('00:00');
  const [startDurationValid, setStartDurationValid] = useState(true);

  const [endTimeEnabled, setEndTimeEnabled] = useState(false);
  const [endDuration, setEndDuration] = useState(
    video.playback.duration.format('mm:ss'),
  );
  const [endDurationValid, setEndDurationValid] = useState(true);

  const shareLink = getShareableVideoLink(
    video.id,
    user?.id,
    durationInSeconds(startDuration),
    durationInSeconds(endDuration),
  );

  const toggleModalVisibility = () => setIsModalVisible(!isModalVisible);

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStartDuration(e.target.value);
  };
  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEndDuration(e.target.value);
  };

  const validateFields = () => {
    setStartDurationValid(
      isTrimFromValid(
        { from: startDuration, to: endDuration },
        video.playback.duration,
      ),
    );

    setEndDurationValid(
      isTrimToValid(
        { from: startDuration, to: endDuration },
        video.playback.duration,
      ),
    );
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
      toggleModalVisibility();
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
          title={`Share ${video.title} with students`}
          displayCancelButton={false}
          confirmButtonText="Copy link"
          confirmButtonIcon={<CopyLinkIcon />}
          footerClass="mb-8"
          onConfirm={handleCopyLink}
          footerText={
            <Typography.Body
              as="div"
              className="text-center pt-8 pb-8 bg-gray-100"
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
          <Typography.Body as="div" className="mb-8">
            Students need both the link and your unique teacher code to access
            to play video(s).
          </Typography.Body>
          <div className="flex justify-between">
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
                ariaLabel="Start time:"
                id="start-time"
                disabled={!startTimeEnabled}
                onChange={handleStartTimeChange}
                isValid={startDurationValid}
                onBlur={validateFields}
                onFocus={() => {}}
              />
            </div>
            <div className="flex items-center">
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
                ariaLabel="End time:"
                id="end-time"
                disabled={!endTimeEnabled}
                onChange={handleEndTimeChange}
                isValid={endDurationValid}
                onBlur={validateFields}
                onFocus={() => {}}
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
