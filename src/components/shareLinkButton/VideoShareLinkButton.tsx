import React, { useState } from 'react';
import ShareSVG from 'src/resources/icons/white-share.svg';
import Button from '@boclips-ui/button';
import { Video } from 'boclips-api-client/dist/types';
import CopyLinkIcon from 'src/resources/icons/copy-link-icon.svg';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import {
  durationInSeconds,
  durationString,
} from 'src/components/cart/AdditionalServices/Trim/trimValidation';
import { Typography } from '@boclips-ui/typography';
import { GoogleClassroomShareLink } from 'src/components/shareLinkButton/googleClassroom/GoogleClassroomShareLink';
import { SegmentBodal } from 'src/components/segmentBodal/SegmentBodal';
import { getShareableVideoLink } from 'src/components/shareLinkButton/getShareableLink';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { Segment } from 'boclips-api-client/dist/sub-clients/collections/model/Segment';
import s from './shareLinkButton.module.less';

interface VideoShareLinkButtonProps {
  iconOnly?: boolean;
  video: Video;
  initialSegment?: Segment;
}

export const VideoShareLinkButton = ({
  iconOnly = false,
  video,
  initialSegment,
}: VideoShareLinkButtonProps) => {
  const client = useBoclipsClient();
  const startingSegment = initialSegment ?? {
    start: 0,
    end: video.playback.duration.asSeconds(),
  };

  const { data: user } = useGetUserQuery();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startDuration, setStartDuration] = useState(
    durationString(startingSegment.start),
  );
  const [endDuration, setEndDuration] = useState(
    durationString(startingSegment.end),
  );
  const [isError, setIsError] = useState(false);

  const shareLink = getShareableVideoLink(
    video.id,
    user?.id,
    durationInSeconds(startDuration),
    durationInSeconds(endDuration),
  );

  const toggleModalVisibility = () => setIsModalVisible(!isModalVisible);

  const handleCopyLink = () => {
    if (isError) {
      return;
    }

    client.shareLinks.trackVideoShareLink(video.id);

    toggleModalVisibility();
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
        className={s.shareLinkButton}
        iconOnly={iconOnly}
      />
      {isModalVisible && (
        <SegmentBodal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          bodalTitle="Share this video with students"
          bodalDescription={
            <>
              Students only need the link to access and play the video{' '}
              <Typography.Body weight="medium">{video.title}</Typography.Body>
            </>
          }
          confirmButtonText="Copy link"
          confirmButtonIcon={<CopyLinkIcon />}
          extraButton={
            <GoogleClassroomShareLink
              link={shareLink}
              postTitle={video.title}
              onClick={() => {}}
            />
          }
          handleConfirm={handleCopyLink}
          duration={video.playback.duration}
          startDuration={startDuration}
          setStartDuration={setStartDuration}
          endDuration={endDuration}
          setEndDuration={setEndDuration}
          setIsError={setIsError}
          videoLink={video.links.self}
        />
      )}
    </>
  );
};
