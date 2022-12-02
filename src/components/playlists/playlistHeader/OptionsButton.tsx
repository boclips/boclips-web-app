import React, { useState } from 'react';
import OptionsDotsSVG from 'src/resources/icons/options-dots.svg';
import c from 'classnames';
import PencilSVG from 'src/resources/icons/pencil.svg';
import CopySVG from 'src/resources/icons/copy.svg';
import BinSVG from 'src/resources/icons/bin.svg';
import { EditPlaylistModal } from 'src/components/playlistModal/EditPlaylistModal';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Button from '@boclips-ui/button';
import { OptionItem } from 'src/components/playlists/playlistHeader/OptionItem';
import { CopyPlaylistModal } from 'src/components/playlists/playlistHeader/CopyPlaylistModal';
import { RemovePlaylistModal } from 'src/components/playlistModal/RemovePlaylistModal';
import s from './style.module.less';

interface Props {
  playlist: Collection;
}

const enum PlaylistModalState {
  NONE,
  EDIT,
  DUPLICATE,
  REMOVE,
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
          showErrorNotification={showErrorNotification}
          onCancel={() => setModalState(PlaylistModalState.NONE)}
        />
      )}
    </>
  );
};
