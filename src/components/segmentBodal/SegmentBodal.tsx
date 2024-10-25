import s from 'src/components/shareLinkButton/shareLinkButton.module.less';
import { Typography } from '@boclips-ui/typography';
import BoCheckbox from 'src/components/common/input/BoCheckbox';
import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { DurationInput } from 'src/components/cart/AdditionalServices/Trim/DurationInput';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import {
  isTrimFromValid,
  isTrimToValid,
} from 'src/components/cart/AdditionalServices/Trim/trimValidation';

interface Props {
  makeModalVisible?: boolean;
  bodalTitle: string;
  bodalDescription?: ReactElement;
  confirmButtonText: string;
  confirmButtonIcon: ReactElement;
  extraButton?: ReactElement;
  handleConfirm: () => void;
  video: Video;
  startDuration: string;
  setStartDuration: (duration: string) => void;
  endDuration: string;
  setEndDuration: (duration: string) => void;
  setIsError: (isError: boolean) => void;
}
export const SegmentBodal = ({
  makeModalVisible,
  bodalTitle,
  bodalDescription,
  confirmButtonText,
  confirmButtonIcon,
  extraButton,
  handleConfirm,
  video,
  startDuration,
  setStartDuration,
  endDuration,
  setEndDuration,
  setIsError,
}: Props) => {
  const toggleModalVisibility = () => setIsModalVisible(!isModalVisible);
  const videoDuration = video.playback.duration.format('mm:ss');

  const [isModalVisible, setIsModalVisible] = useState(makeModalVisible);
  const [startTimeEnabled, setStartTimeEnabled] = useState(false);
  const [startDurationValid, setStartDurationValid] = useState(true);
  const [endTimeEnabled, setEndTimeEnabled] = useState(false);
  const [endDurationValid, setEndDurationValid] = useState(true);

  useEffect(() => {
    if (startDuration.length === 5) validateFields();
    if (endDuration.length === 5) validateFields();
    setIsError(!startDuration || !startDuration);
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

  return (
    <Bodal
      onCancel={toggleModalVisibility}
      title={bodalTitle}
      displayCancelButton={false}
      confirmButtonText={confirmButtonText}
      confirmButtonIcon={confirmButtonIcon}
      footerClass={s.bodalButtons}
      onConfirm={handleConfirm}
      smallSize={false}
      extraButton={extraButton}
    >
      {bodalDescription && (
        <Typography.Body
          as="div"
          className="mb-10 text-gray-800"
          data-qa="share-link-body"
        >
          bodalDescription
        </Typography.Body>
      )}
      <div className="flex justify-center mb-16">
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
  );
};
