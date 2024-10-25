import React, { useEffect, useState } from 'react';
import ShareSVG from 'src/resources/icons/white-share.svg';
import CopyLinkIcon from 'src/resources/icons/copy-link-icon.svg';
import Button from '@boclips-ui/button';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { Typography } from '@boclips-ui/typography';
import { GoogleClassroomShareLink } from 'src/components/shareLinkButton/googleClassroom/GoogleClassroomShareLink';
import { getShareablePlaylistLink } from 'src/components/shareLinkButton/getShareableLink';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { usePlatformInteractedWithEvent } from 'src/hooks/usePlatformInteractedWithEvent';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import s from './shareLinkButton.module.less';

interface PlaylistShareLinkButtonProps {
  iconOnly?: boolean;
  shareButtonHeight?: string;
  playlist: {
    id: string;
    title: string;
  };
}

export const PlaylistShareLinkButton = ({
  iconOnly = false,
  shareButtonHeight,
  playlist,
}: PlaylistShareLinkButtonProps) => {
  const client = useBoclipsClient();

  const { data: user, isLoading: userIsLoading } = useGetUserQuery();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const shareLink = getShareablePlaylistLink(playlist.id, user?.id);
  const { mutate: trackPlatformInteraction } = usePlatformInteractedWithEvent();

  const toggleModalVisibility = async () => {
    trackPlatformInteraction({
      subtype: 'PLAYLIST_SHARE_LINK_MODAL_OPENED',
    });
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const main = document.querySelector('main');
    if (isModalVisible && main) {
      main.removeAttribute('tabIndex');
    }
    return () => {
      if (main) main.setAttribute('tabIndex', '-1');
    };
  }, [isModalVisible]);

  const handleCopyLink = () => {
    trackPlatformInteraction({
      subtype: 'PLAYLIST_SHARE_LINK_COPIED',
    });

    client.shareLinks.trackCollectionShareLink(playlist.id);

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
        height={shareButtonHeight}
        className={s.shareLinkButton}
        iconOnly={iconOnly}
      />
      {isModalVisible && (
        <Bodal
          onCancel={toggleModalVisibility}
          title="Share this playlist with students"
          displayCancelButton={false}
          confirmButtonText="Copy link"
          confirmButtonIcon={<CopyLinkIcon />}
          footerClass={s.shareLinkBodalButtons}
          onConfirm={handleCopyLink}
          smallSize={false}
          extraButton={
            !userIsLoading && (
              <GoogleClassroomShareLink
                link={shareLink}
                postTitle={playlist.title}
                onClick={() => {}}
              />
            )
          }
        >
          <Typography.Body as="div" className="mb-14 text-gray-800">
            <p>
              {playlist.title} will be shared with the time bookmarks you
              currently have set.
            </p>
            <br />
            <p>Students only need the link to access and play video(s).</p>
          </Typography.Body>
        </Bodal>
      )}
    </>
  );
};
