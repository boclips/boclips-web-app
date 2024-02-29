import React, { ChangeEvent, useState } from 'react';
import ShareSVG from 'src/resources/icons/white-share.svg';
import Button from '@boclips-ui/button';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { Video } from 'boclips-api-client/dist/types';
import s from './shareButton.module.less';
import CopyLinkIcon from 'src/resources/icons/copy-link-icon.svg';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { DurationInput } from 'src/components/cart/AdditionalServices/Trim/DurationInput';
import BoCheckbox from 'src/components/common/input/BoCheckbox';

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
  const toggleModalVisibility = () => setIsModalVisible(!isModalVisible);
  const handleStartTimeCheckboxChanged = (e: ChangeEvent<HTMLInputElement>) =>
    setStartTimeEnabled(e.currentTarget.checked);

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
              onChange={handleStartTimeCheckboxChanged}
              showLabel={false}
            />
            <DurationInput
              label="Start time:"
              value="00:00"
              ariaLabel="Start time:"
              id="start-time"
              disabled={!startTimeEnabled}
              onChange={() => {}}
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
