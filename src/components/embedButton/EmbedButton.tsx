import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import Button from '@boclips-ui/button';
import EmbedIcon from 'src/resources/icons/embed-icon.svg';
import Tooltip from '@boclips-ui/tooltip';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import s from './EmbedButton.module.less';
import { displayNotification } from '../common/notification/displayNotification';

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
  label = 'Get embed code',
  onClick,
}: Props) => {
  const client = useBoclipsClient();
  const onClickEvent = async () => {
    if (onClick) {
      onClick();
    }

    if (!video && !licensedContent) {
      return;
    }
    const link = video
      ? await client.videos.createEmbedCode(video)
      : await client.licenses.createEmbedCode(licensedContent);

    await navigator.clipboard.writeText(link.embed);
    displayNotification(
      'success',
      'Embed code copied!',
      'You can now embed this video in your LMS',
      'embed-code-copied-to-clipboard-notificaiton',
    );
  };

  const defaultWidth = iconOnly ? '40px' : '200px';
  const button = (
    <Button
      className={s.embedButton}
      iconOnly={iconOnly}
      icon={<EmbedIcon />}
      name="Embed"
      aria-label="embed"
      onClick={onClickEvent}
      width={width || defaultWidth}
      height={height || '40px'}
      text={!iconOnly && label}
    />
  );

  return iconOnly ? <Tooltip text={label}>{button}</Tooltip> : button;
};
