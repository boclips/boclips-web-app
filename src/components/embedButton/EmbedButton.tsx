import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import Button from '@boclips-ui/button';
import EmbedIcon from 'src/resources/icons/embed-icon.svg';
import Tooltip from '@boclips-ui/tooltip';
import s from './EmbedButton.module.less';
import { displayNotification } from '../common/notification/displayNotification';

interface Props {
  video: Video;
}
export const EmbedButton = ({ video }: Props) => {
  const client = useBoclipsClient();
  const onClick = async () => {
    const link = await client.videos.createEmbedCode(video);
    await navigator.clipboard.writeText(link.embed);
    displayNotification(
      'success',
      'Embed code copied!',
      'You can now embed this video in your LMS',
      'embed-code-copied-to-clipboard-notificaiton',
    );
  };

  return (
    <Tooltip text="Copy embed code">
      <Button
        className={s.embedButton}
        iconOnly
        icon={<EmbedIcon />}
        name="Embed"
        aria-label="embed"
        onClick={onClick}
        width="40px"
        height="40px"
      />
    </Tooltip>
  );
};
