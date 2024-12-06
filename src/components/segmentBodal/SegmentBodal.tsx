import { Typography } from 'boclips-ui';
import BoCheckbox from '@components/common/input/BoCheckbox';
import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { DurationInput } from '@components/cart/AdditionalServices/Trim/DurationInput';
import { Bodal } from '@components/common/bodal/Bodal';
import {
  durationInSeconds,
  isTrimFromValid,
  isTrimToValid,
} from '@components/cart/AdditionalServices/Trim/trimValidation';
import { Duration } from 'dayjs/plugin/duration';
import c from 'classnames';
import { VideoPlayer } from '@components/videoCard/VideoPlayer';
import { Link } from 'boclips-api-client/dist/sub-clients/common/model/LinkEntity';
import s from './style.module.less';

interface Props {
  isModalVisible: boolean;
  setIsModalVisible: (_: boolean) => void;
  bodalTitle: string;
  bodalDescription?: ReactElement;
  confirmButtonText: string;
  confirmButtonIcon: ReactElement;
  extraButton?: ReactElement;
  handleConfirm: () => void;
  duration: Duration;
  startDuration: string;
  setStartDuration: (duration: string) => void;
  endDuration: string;
  setEndDuration: (duration: string) => void;
  setIsError: (isError: boolean) => void;
  footerClass?: string;
  videoLink?: Link;
}

export const SegmentBodal = ({
  isModalVisible,
  setIsModalVisible,
  bodalTitle,
  bodalDescription,
  confirmButtonText,
  confirmButtonIcon,
  extraButton,
  handleConfirm,
  duration,
  startDuration,
  setStartDuration,
  endDuration,
  setEndDuration,
  setIsError,
  footerClass,
  videoLink,
}: Props) => {
  const toggleModalVisibility = () => setIsModalVisible(!isModalVisible);

  const [startTimeEnabled, setStartTimeEnabled] = useState(false);
  const [startDurationValid, setStartDurationValid] = useState(true);
  const [endTimeEnabled, setEndTimeEnabled] = useState(false);
  const [endDurationValid, setEndDurationValid] = useState(true);

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
        isTrimFromValid({ from: startDuration, to: endDuration }, duration),
      );
    }

    if (endTimeEnabled) {
      setEndDurationValid(
        isTrimToValid({ from: startDuration, to: endDuration }, duration),
      );
    }

    setIsError(!startDurationValid || !endDurationValid);
  };

  return (
    <Bodal
      onCancel={toggleModalVisibility}
      title={bodalTitle}
      displayCancelButton={false}
      confirmButtonText={confirmButtonText}
      confirmButtonIcon={confirmButtonIcon}
      footerClass={c(s.segmentBodalButtons, footerClass)}
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
          {bodalDescription}
        </Typography.Body>
      )}
      {videoLink && (
        <div className={c(s.segmentBodalPlayer, 'mb-8')}>
          <VideoPlayer
            videoLink={videoLink}
            showDurationBadge
            segment={{
              start: durationInSeconds(startDuration),
              end: durationInSeconds(endDuration),
            }}
          />
        </div>
      )}
      <div className="flex justify-center mb-8">
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
            placeholder={duration.format('mm:ss')}
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
