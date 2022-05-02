import React from 'react';
import Button from '@boclips-ui/button';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import CopyLinkIcon from 'src/resources/icons/copy-link-icon.svg';
import c from 'classnames';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import s from './style.module.less';

interface Props {
  link: string;
}

export const PlaylistShareButton = ({ link }: Props) => {
  const linkCopiedHotjarEvent = () =>
    AnalyticsFactory.hotjar().event(HotjarEvents.PlaylistShareableLinkCopied);

  const handleClick = () => {
    navigator.clipboard.writeText(link).then(() => {
      displayNotification(
        'success',
        'Link copied!',
        'You can now share this playlist using the copied link',
        'playlist-link-copied-notification',
      );

      linkCopiedHotjarEvent();
    });
  };

  return (
    <div className={c(s.sharePlaylistButton, 'md:order-2 sm:order-last')}>
      <Button
        dataQa="share-playlist-button"
        onClick={handleClick}
        icon={<CopyLinkIcon />}
        type="outline"
        text="Get shareable link"
      />
    </div>
  );
};
