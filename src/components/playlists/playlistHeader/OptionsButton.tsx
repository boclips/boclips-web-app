import React, { useState } from 'react';
import OptionsDotsSVG from '@resources/icons/options-dots.svg?react';
import c from 'classnames';
import PencilSVG from '@resources/icons/pencil.svg?react';
import CopySVG from '@resources/icons/copy.svg?react';
import ReorderSVG from '@resources/icons/reorder.svg?react';
import BinSVG from '@resources/icons/bin.svg?react';
import CrossSVG from '@resources/icons/cross-icon.svg?react';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { displayNotification } from '@components/common/notification/displayNotification';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from 'boclips-ui';
import { OptionItem } from '@components/playlists/playlistHeader/OptionItem';
import { CopyPlaylistModal } from '@components/playlistModal/CopyPlaylistModal';
import ReorderModal from '@components/playlistModal/reorder/ReorderPlaylistModal';
import { RemovePlaylistModal } from '@components/playlistModal/RemovePlaylistModal';
import { UnfollowPlaylistModal } from '@components/playlistModal/UnfollowPlaylistModal';
import { CollectionPermission } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionPermissions';
import { FeatureGate } from '@components/common/FeatureGate';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import ShareSVG from '@resources/icons/black-share.svg?react';
import { EditPlaylistModal } from '@components/playlistModal/EditPlaylistModal';
import { EditPlaylistPermissionsModal } from '@components/playlistModal/EditPlaylistPermissionsModal';
import { copySharePlaylistLink } from '@src/services/copySharePlaylistLink';
import PlusSign from '@resources/icons/plus-sign.svg?react';
import { useNavigate } from 'react-router-dom';
import { usePlatformInteractedWithEvent } from '@src/hooks/usePlatformInteractedWithEvent';
import { useGetUserQuery } from '@src/hooks/api/userQuery';
import s from './style.module.less';

interface Props {
  playlist: Collection;
}

const enum PlaylistModalState {
  NONE,
  EDIT,
  DUPLICATE,
  REMOVE,
  REORDER,
  UNFOLLOW,
  SHARE_WITH_TEACHERS,
}

export const OptionsButton = ({ playlist }: Props) => {
  const navigate = useNavigate();
  const { mutate: trackPlatformInteraction } = usePlatformInteractedWithEvent();
  const { data: user, isLoading: userLoading } = useGetUserQuery();

  const [modalState, setModalState] = useState<PlaylistModalState>(
    PlaylistModalState.NONE,
  );

  const showSuccessNotification = (message: string, dataQa?: string) => {
    displayNotification('success', message, '', dataQa);
    setModalState(PlaylistModalState.NONE);
  };

  const showErrorNotification = (message: string, dataQa?: string) => {
    displayNotification('error', message, 'Please try again', dataQa);
  };

  const handleCopySharePlaylistLink = () => {
    if (!userLoading && user.account?.products.includes(Product.CLASSROOM)) {
      trackPlatformInteraction({
        subtype: 'PLAYLIST_SHARE_TEACHERS_CODE_COPIED',
      });
    }
    copySharePlaylistLink(playlist);
  };

  return (
    <>
      <div className={c(s.playlistButton, 'md:order-2 sm:order-last')}>
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger className={s.optionsButton} asChild>
            <Button
              onClick={() =>
                trackPlatformInteraction({
                  subtype: 'PLAYLIST_OPTIONS_BUTTON_CLICKED',
                })
              }
              text="Options"
              icon={<OptionsDotsSVG />}
              type="outline"
              height="48px"
            />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={s.optionsDropdownWrapper}
              align="end"
            >
              <DropdownMenu.Group>
                {(playlist?.mine ||
                  playlist?.permissions.anyone ===
                    CollectionPermission.EDIT) && (
                  <OptionItem
                    text="Add videos"
                    label="Add videos to this playlist"
                    icon={<PlusSign aria-hidden stroke="black" width={20} />}
                    onSelect={() => navigate('/videos')}
                  />
                )}
                {playlist.mine && (
                  <OptionItem
                    text="Edit"
                    label="Edit playlist"
                    icon={<PencilSVG aria-hidden width={20} />}
                    onSelect={() => {
                      setModalState(PlaylistModalState.EDIT);
                      trackPlatformInteraction({
                        subtype: 'PLAYLIST_EDIT_BUTTON_CLICKED',
                      });
                    }}
                  />
                )}
                {!playlist.mine && (
                  <OptionItem
                    text="Unfollow"
                    label="Unfollow playlist"
                    icon={<CrossSVG aria-hidden width={20} />}
                    onSelect={() => {
                      setModalState(PlaylistModalState.UNFOLLOW);
                    }}
                  />
                )}
                {(playlist?.mine ||
                  playlist?.permissions.anyone ===
                    CollectionPermission.EDIT) && (
                  <OptionItem
                    text="Reorder videos"
                    label="Reorder videos in this playlist"
                    icon={<ReorderSVG aria-hidden width={20} />}
                    onSelect={() => {
                      setModalState(PlaylistModalState.REORDER);
                      trackPlatformInteraction({
                        subtype: 'PLAYLIST_REORDER_VIDEOS_BUTTON_CLICKED',
                      });
                    }}
                  />
                )}
                <OptionItem
                  text="Make a copy"
                  label="Make a copy of this playlist"
                  icon={<CopySVG aria-hidden width={20} />}
                  onSelect={() => {
                    setModalState(PlaylistModalState.DUPLICATE);
                    trackPlatformInteraction({
                      subtype: 'PLAYLIST_MAKE_COPY_BUTTON_CLICKED',
                    });
                  }}
                />
                {playlist.mine && (
                  <FeatureGate product={Product.CLASSROOM}>
                    <OptionItem
                      text="Share with teachers"
                      label="Share with teachers"
                      icon={<ShareSVG aria-hidden width={20} />}
                      onSelect={() => {
                        setModalState(PlaylistModalState.SHARE_WITH_TEACHERS);
                        trackPlatformInteraction({
                          subtype:
                            'PLAYLIST_SHARE_WITH_TEACHERS_BUTTON_CLICKED',
                        });
                      }}
                    />
                  </FeatureGate>
                )}
                {playlist.mine && (
                  <OptionItem
                    text="Remove"
                    label="Remove this playlist"
                    icon={<BinSVG aria-hidden width={20} />}
                    onSelect={() => {
                      setModalState(PlaylistModalState.REMOVE);
                    }}
                  />
                )}
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      {modalState === PlaylistModalState.EDIT && (
        <EditPlaylistModal
          playlist={playlist}
          showSuccessNotification={showSuccessNotification}
          showErrorNotification={showErrorNotification}
          onCancel={() => setModalState(PlaylistModalState.NONE)}
        />
      )}
      {modalState === PlaylistModalState.DUPLICATE && (
        <CopyPlaylistModal
          playlist={playlist}
          showSuccessNotification={showSuccessNotification}
          showErrorNotification={showErrorNotification}
          onCancel={() => setModalState(PlaylistModalState.NONE)}
        />
      )}
      {modalState === PlaylistModalState.REMOVE && (
        <RemovePlaylistModal
          playlist={playlist}
          onCancel={() => setModalState(PlaylistModalState.NONE)}
        />
      )}
      {modalState === PlaylistModalState.REORDER && (
        <ReorderModal
          playlist={playlist}
          onCancel={() => setModalState(PlaylistModalState.NONE)}
          confirmButtonText="Update"
        />
      )}
      {modalState === PlaylistModalState.UNFOLLOW && (
        <UnfollowPlaylistModal
          playlist={playlist}
          onCancel={() => setModalState(PlaylistModalState.NONE)}
        />
      )}
      {modalState === PlaylistModalState.SHARE_WITH_TEACHERS && (
        <EditPlaylistPermissionsModal
          title="Share this playlist with other teachers"
          playlist={playlist}
          handleClick={handleCopySharePlaylistLink}
          onCancel={() => setModalState(PlaylistModalState.NONE)}
        />
      )}
    </>
  );
};
