import React, { useState } from 'react';
import OptionsDotsSVG from 'src/resources/icons/options-dots.svg';
import c from 'classnames';
import PencilSVG from 'src/resources/icons/pencil.svg';
import CopySVG from 'src/resources/icons/copy.svg';
import RearrangeSVG from 'src/resources/icons/rearrange.svg';
import BinSVG from 'src/resources/icons/bin.svg';
import CrossSVG from 'src/resources/icons/cross-icon.svg';
import { EditPlaylistModal } from 'src/components/playlistModal/EditPlaylistModal';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Button from '@boclips-ui/button';
import { OptionItem } from 'src/components/playlists/playlistHeader/OptionItem';
import { CopyPlaylistModal } from 'src/components/playlistModal/CopyPlaylistModal';
import RearrangeModal from 'src/components/playlistModal/rearrange/RearrangePlaylistModal';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { RemovePlaylistModal } from 'src/components/playlistModal/RemovePlaylistModal';
import { UnfollowPlaylistModal } from 'src/components/playlistModal/UnfollowPlaylistModal';
import s from './style.module.less';

interface Props {
  playlist: Collection;
}

const enum PlaylistModalState {
  NONE,
  EDIT,
  DUPLICATE,
  REMOVE,
  REARRANGE,
  UNFOLLOW,
}

export const OptionsButton = ({ playlist }: Props) => {
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
                <FeatureGate feature="BO_WEB_APP_REORDER_VIDEOS_IN_PLAYLIST">
                  {playlist?.mine && (
                    <OptionItem
                      text="Rearrange"
                      label="Rearrange videos in this playlist"
                      icon={<RearrangeSVG aria-hidden />}
                      onSelect={() => {
                        setModalState(PlaylistModalState.REARRANGE);
                      }}
                    />
                  )}
                </FeatureGate>
                <OptionItem
                  text="Make a copy"
                  label="Make a copy of this playlist"
                  icon={<CopySVG aria-hidden />}
                  onSelect={() => {
                    setModalState(PlaylistModalState.DUPLICATE);
                  }}
                />
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
      {modalState === PlaylistModalState.REARRANGE && (
        <RearrangeModal
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
    </>
  );
};
