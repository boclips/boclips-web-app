import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { Segment } from 'boclips-api-client/dist/sub-clients/collections/model/Segment';
import formatDuration from '@src/components/playlists/buttons/playlistBookmark/helpers/formatDuration';
import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  durationInSeconds,
  isTrimFromValid,
  isTrimToValid,
} from '@src/components/cart/AdditionalServices/Trim/trimValidation';
import { Typography } from '@boclips-ui/typography';
import { Bodal } from '@src/components/common/bodal/Bodal';
import BoCheckbox from '@src/components/common/input/BoCheckbox';
import { DurationInput } from '@src/components/cart/AdditionalServices/Trim/DurationInput';
import { VideoPlayer } from '@src/components/videoCard/VideoPlayer';

interface BookmarkModalProps {
  onCancel: () => void;
  title: string;
  video: Video;
  initialSegment?: Segment;
  onConfirm: (videoId: string, segment: Segment) => void;
}

const BookmarkModal = ({
  onCancel,
  title,
  video,
  initialSegment,
  onConfirm,
}: BookmarkModalProps) => {
  const videoDuration = video.playback.duration.format('mm:ss');
  const startSegment = initialSegment
    ? formatDuration(initialSegment.start)
    : '00:00';
  const endSegment = initialSegment
    ? formatDuration(initialSegment.end)
    : videoDuration;

  const [startTimeEnabled, setStartTimeEnabled] = useState(!!initialSegment);
  const [startDuration, setStartDuration] = useState(startSegment);
  const [startDurationValid, setStartDurationValid] = useState(true);
  const [endTimeEnabled, setEndTimeEnabled] = useState(!!initialSegment);
  const [endDuration, setEndDuration] = useState(endSegment);
  const [endDurationValid, setEndDurationValid] = useState(true);

  useEffect(() => {
    validateFields();
  }, [startDuration, endDuration]);

  useEffect(() => {
    const main = document.querySelector('main');
    if (main) {
      main.removeAttribute('tabIndex');
    }
    return () => {
      if (main) main.setAttribute('tabIndex', '-1');
    };
  }, []);

  const handleStartTimeChange = (value: string) => {
    setStartDuration(value);
    if (value.length === 5) validateFields();
  };

  const handleEndTimeChange = (value: string) => {
    setEndDuration(value);
    if (value.length === 5) validateFields();
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

  const handleConfirm = () => {
    if (!startDurationValid || !endDurationValid) return;

    let segment: Segment;

    if (startTimeEnabled || endTimeEnabled) {
      segment = {
        start: durationInSeconds(startDuration),
        end: durationInSeconds(endDuration),
      };
    }

    onConfirm(video.id, segment);
  };

  return (
    <Bodal
      onCancel={onCancel}
      title={title}
      displayCancelButton
      confirmButtonText="Set"
      onConfirm={handleConfirm}
    >
      <Typography.Body
        as="div"
        className="mb-14 text-gray-800"
        data-qa="share-link-body"
      >
        Set custom start and end times to bookmark a specific section of the
        video for students to focus on.
      </Typography.Body>
      <div className="mb-8">
        <VideoPlayer
          video={video}
          showDurationBadge
          segment={{
            start: durationInSeconds(startDuration),
            end: durationInSeconds(endDuration),
          }}
        />
      </div>
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
  );
};

export default BookmarkModal;
