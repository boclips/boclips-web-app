import React, { ChangeEvent, useState } from 'react';
import ShareSVG from 'src/resources/icons/white-share.svg';
import Button from '@boclips-ui/button';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { Video } from 'boclips-api-client/dist/types';
import CopyLinkIcon from 'src/resources/icons/copy-link-icon.svg';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { DurationInput } from 'src/components/cart/AdditionalServices/Trim/DurationInput';
import BoCheckbox from 'src/components/common/input/BoCheckbox';
import dayjs from 'dayjs';
import s from './shareButton.module.less';

interface VideoShareButtonProps {
  iconOnly?: boolean;
  video: Video;
}

export const VideoShareButton = ({
  iconOnly = false,
  video,
}: VideoShareButtonProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startTimeEnabled, setStartTimeEnabled] = useState(false);
  const [startSeconds, setStartSeconds] = useState(0);

  const [endTimeEnabled, setEndTimeEnabled] = useState(false);
  const [endSeconds, setEndSeconds] = useState(
    video.playback.duration.asSeconds(),
  );
  const toggleModalVisibility = () => setIsModalVisible(!isModalVisible);

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStartSeconds(dayjs.duration(e.target.value).asSeconds());
  };
  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEndSeconds(dayjs.duration(e.target.value).asSeconds());
  };

  const { data: user } = useGetUserQuery();
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
          footerText={`Your unique teacher code is ${user.shareCode}`}
        >
          <span>
            Students need both the link and your unique teacher code to access
            to play video(s).
          </span>
          <div>
            <BoCheckbox
              aria-label="start time enabled"
              checked={false}
              id="start-time-checkbox"
              name="Start time enabled"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setStartTimeEnabled(e.currentTarget.checked)
              }
              showLabel={false}
            />
            <DurationInput
              label="Start time:"
              value={dayjs().set('seconds', startSeconds).format('mm:ss')}
              ariaLabel="Start time:"
              id="start-time"
              disabled={!startTimeEnabled}
              onChange={handleStartTimeChange}
              isValid
              onBlur={() => {}}
              onFocus={() => {}}
            />
            <BoCheckbox
              aria-label="end time enabled"
              checked={false}
              id="end-time-checkbox"
              name="End time enabled"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEndTimeEnabled(e.currentTarget.checked)
              }
              showLabel={false}
            />
            <DurationInput
              label="End time:"
              value={dayjs().set('seconds', endSeconds).format('mm:ss')}
              ariaLabel="End time:"
              id="end-time"
              disabled={!endTimeEnabled}
              onChange={handleEndTimeChange}
              isValid
              onBlur={() => {}}
              onFocus={() => {}}
            />
          </div>
        </Bodal>
      )}
    </>
  );
};
