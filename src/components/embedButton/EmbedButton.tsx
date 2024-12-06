import React, { useState } from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { useBoclipsClient } from '@src/components/common/providers/BoclipsClientProvider';
import Tooltip, { Button } from 'boclips-ui';
import EmbedIcon from '@resources/icons/embed-icon.svg?react';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import { SegmentBodal } from '@src/components/segmentBodal/SegmentBodal';
import { durationInSeconds } from '@src/components/cart/AdditionalServices/Trim/trimValidation';
import c from 'classnames';
import { displayNotification } from '../common/notification/displayNotification';
import s from './EmbedButton.module.less';

interface Props {
  video?: Video;
  licensedContent?: LicensedContent;
  iconOnly?: boolean;
  label?: string;
  width?: string;
  height?: string;
  onClick?: () => void;
}

export const EmbedButton = ({
  video,
  licensedContent,
  width,
  height,
  iconOnly = true,
  label = 'Embed video',
  onClick,
}: Props) => {
  const client = useBoclipsClient();
  const duration =
    video?.playback?.duration ?? licensedContent?.videoMetadata?.duration;
  const videoDuration = duration.format('mm:ss');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startDuration, setStartDuration] = useState('00:00');
  const [endDuration, setEndDuration] = useState(videoDuration);
  const [isError, setIsError] = useState(false);

  const toggleModalVisibility = () => setIsModalVisible(!isModalVisible);
  const handleEmbedCopy = async () => {
    if (onClick) {
      onClick();
    }

    if ((!video && !licensedContent) || isError) {
      return;
    }
    const link = video
      ? await client.videos.createEmbedCode(
          video,
          durationInSeconds(startDuration),
          durationInSeconds(endDuration),
        )
      : await client.licenses.createEmbedCode(
          licensedContent,
          durationInSeconds(startDuration),
          durationInSeconds(endDuration),
        );
    toggleModalVisibility();
    await navigator.clipboard.writeText(link.embed);
    displayNotification(
      'success',
      'Embed video code is copied!',
      'You can now embed this video in your LMS',
      'embed-code-copied-to-clipboard-notification',
    );
  };

  const defaultWidth = iconOnly ? '40px' : '200px';
  const button = (
    <Button
      className={s.embedButton}
      iconOnly={iconOnly}
      icon={<EmbedIcon />}
      name="Embed"
      aria-label="Embed"
      onClick={toggleModalVisibility}
      width={width || defaultWidth}
      height={height || '40px'}
      text={!iconOnly && label}
    />
  );

  const element = iconOnly ? <Tooltip text={label}>{button}</Tooltip> : button;
  return (
    <>
      {element}
      {isModalVisible && (
        <SegmentBodal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          bodalTitle="Copy embed code"
          confirmButtonText="Copy embed"
          confirmButtonIcon={<EmbedIcon />}
          handleConfirm={handleEmbedCopy}
          duration={duration}
          startDuration={startDuration}
          setStartDuration={setStartDuration}
          endDuration={endDuration}
          setEndDuration={setEndDuration}
          setIsError={setIsError}
          footerClass={c(s.embedButton, s.embedModalButton)}
          videoLink={
            video?.links?.self ?? licensedContent?.videoMetadata?.links?.self
          }
        />
      )}
    </>
  );
};
