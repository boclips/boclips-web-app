import React, { useState } from 'react';
import OptionsDotsSVG from 'src/resources/icons/options-dots.svg';
import c from 'classnames';
import PencilSVG from 'src/resources/icons/pencil.svg';
import CopySVG from 'src/resources/icons/copy.svg';
import ReorderSVG from 'src/resources/icons/reorder.svg';
import BinSVG from 'src/resources/icons/bin.svg';
import CrossSVG from 'src/resources/icons/cross-icon.svg';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Button from '@boclips-ui/button';
import { OptionItem } from 'src/components/playlists/playlistHeader/OptionItem';
import { CopyPlaylistModal } from 'src/components/playlistModal/CopyPlaylistModal';
import ReorderModal from 'src/components/playlistModal/reorder/ReorderPlaylistModal';
import { RemovePlaylistModal } from 'src/components/playlistModal/RemovePlaylistModal';
import { UnfollowPlaylistModal } from 'src/components/playlistModal/UnfollowPlaylistModal';
import { CollectionPermission } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionPermissions';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import ShareSVG from 'src/resources/icons/black-share.svg';
import { EditPlaylistModal } from 'src/components/playlistModal/EditPlaylistModal';
import { EditPlaylistPermissionsModal } from 'src/components/playlistModal/EditPlaylistPermissionsModal';
import { copySharePlaylistLink } from 'src/services/copySharePlaylistLink';
import PlusSign from 'src/resources/icons/plus-sign.svg';
import { useNavigate } from 'react-router-dom';
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

  return (
    <>
      <div className={c(s.playlistButton, 'md:order-2 sm:order-last')}>
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger className={s.optionsButton} asChild>
            <Button
              onClick={() => null}
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
                    icon={<PlusSign aria-hidden stroke="black" />}
                    onSelect={() => navigate('/videos')}
                  />
                )}
                {playlist.mine && (
                  <OptionItem
                    text="Edit"
                    label="Edit playlist"
                    icon={<PencilSVG aria-hidden />}
                    onSelect={() => {
                      setModalState(PlaylistModalState.EDIT);
                    }}
                  />
                )}
                {!playlist.mine && (
                  <OptionItem
                    text="Unfollow"
                    label="Unfollow playlist"
                    icon={<CrossSVG aria-hidden />}
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
                    icon={<ReorderSVG aria-hidden />}
                    onSelect={() => {
                      setModalState(PlaylistModalState.REORDER);
                    }}
                  />
                )}
                <OptionItem
                  text="Make a copy"
                  label="Make a copy of this playlist"
                  icon={<CopySVG aria-hidden />}
                  onSelect={() => {
                    setModalState(PlaylistModalState.DUPLICATE);
                  }}
                />
                {playlist.mine && (
                  <FeatureGate product={Product.CLASSROOM}>
                    <OptionItem
                      text="Share with teachers"
                      label="Share with teachers"
                      icon={<ShareSVG aria-hidden />}
                      onSelect={() => {
                        setModalState(PlaylistModalState.SHARE_WITH_TEACHERS);
                      }}
                    />
                  </FeatureGate>
                )}
                {playlist.mine && (
                  <OptionItem
                    text="Remove"
                    label="Remove this playlist"
                    icon={<BinSVG aria-hidden />}
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
          handleClick={() => copySharePlaylistLink(playlist)}
          onCancel={() => setModalState(PlaylistModalState.NONE)}
        />
      )}
    </>
  );
};
