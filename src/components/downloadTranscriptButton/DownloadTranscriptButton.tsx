import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import Button from '@boclips-ui/button';
import TranscriptIcon from 'src/resources/icons/transcript-icon.svg';
import Tooltip from '@boclips-ui/tooltip';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import s from './downloadTranscriptButton.module.less';

interface Props {
  video: Video;
}
export const DownloadTranscriptButton = ({ video }: Props) => {
  const client = useBoclipsClient();
  const onClick = async () => {
    await client.videos
      .getTranscript(video)
      .then((response) => {
        const href = URL.createObjectURL(new Blob([response.content]));

        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', response.filename);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .catch(() => {
        displayNotification('error', `Download failed!`, '', ``);
      });
  };

  return (
    <Tooltip text="Download transcript">
      <Button
        className={s.downloadTranscriptButton}
        iconOnly
        type="outline"
        icon={<TranscriptIcon />}
        name="download-transcript"
        aria-label="download-transcript"
        onClick={onClick}
        width="40px"
        height="40px"
      />
    </Tooltip>
  );
};
