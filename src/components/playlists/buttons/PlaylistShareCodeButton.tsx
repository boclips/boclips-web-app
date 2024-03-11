import React, { useState } from 'react';
import ShareSVG from 'src/resources/icons/white-share.svg';
import CopyLinkIcon from 'src/resources/icons/copy-link-icon.svg';
import Button from '@boclips-ui/button';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { Typography } from '@boclips-ui/typography';
import { GoogleClassroomShareLink } from 'src/components/videoShareButton/googleClassroom/GoogleClassroomShareLink';
import { getShareablePlaylistLink } from 'src/components/videoShareButton/getShareableLink';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import s from './playlistShareCodeButton.module.less';

interface PlaylistShareCodeButtonProps {
  iconOnly?: boolean;
  shareButtonHeight?: string;
  playlist: {
    id: string;
    title: string;
  };
}

export const PlaylistShareCodeButton = ({
  iconOnly = false,
  shareButtonHeight,
  playlist,
}: PlaylistShareCodeButtonProps) => {
  const { data: user, isLoading: userIsLoading } = useGetUserQuery();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const shareLink = getShareablePlaylistLink(playlist.id, user?.id);

  const toggleModalVisibility = () => setIsModalVisible(!isModalVisible);

  const handleCopyLink = () => {
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
        className={s.shareButton}
        iconOnly={iconOnly}
      />
      {isModalVisible && (
        <Bodal
          onCancel={toggleModalVisibility}
          title="Share this playlist with students"
          displayCancelButton={false}
          confirmButtonText="Copy link"
          confirmButtonIcon={<CopyLinkIcon />}
          footerClass={s.bodalButtons}
          onConfirm={handleCopyLink}
          smallSize={false}
          footerText={
            !userIsLoading && (
              <Typography.Body
                as="div"
                className="text-center pt-4 pb-6 text-gray-800"
                data-qa="share-code-footer"
              >
                {`Your unique Teacher code is `}
                <Typography.Body weight="medium">
                  {user.shareCode}
                </Typography.Body>
              </Typography.Body>
            )
          }
          extraButton={
            !userIsLoading && (
              <GoogleClassroomShareLink
                link={shareLink}
                postTitle={playlist.title}
                postBody={`Use code ${user.shareCode} to view this.`}
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
            <p>
              Students need both the link and your unique teacher code to access
              and play video(s).
            </p>
          </Typography.Body>
        </Bodal>
      )}
    </>
  );
};
