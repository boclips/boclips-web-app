import React, { useState } from 'react';
import OptionsDots from 'src/resources/icons/options-dots.svg';
import c from 'classnames';
import { EditPlaylistModal } from 'src/components/playlistModal/EditPlaylistModal';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
// import { Typography } from '@boclips-ui/typography';
import Button from '@boclips-ui/button';
import s from './playlistHeader/style.module.less';

interface Props {
  playlist: Collection;
}

export const OptionsButton = ({ playlist }: Props) => {
  const [showEditPlaylistModal, setShowEditPlaylistModal] =
    useState<boolean>(false);

  const handleEditPlaylistSuccess = (playlistTitle: string) => {
    displayNotification(
      'success',
      `Playlist "${playlistTitle}" edited`,
      '',
      `edit-playlist-success`,
    );
    setShowEditPlaylistModal(false);
  };

  const handleEditPlaylistError = (playlistTitle: string) => {
    displayNotification(
      'error',
      `Error: Failed to edit playlist "${playlistTitle}"`,
      'Please try again',
      `edit-playlist-failed`,
    );
  };

  return (
    <>
      <div className={c(s.playlistButton, 'md:order-2 sm:order-last')}>
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger className={s.optionsButton} asChild>
            <Button
              onClick={() => null}
              text="Options"
              icon={<OptionsDots />}
              type="outline"
              height="48px"
            />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className={s.optionsDropdownWrapper}>
              <DropdownMenu.Group>
                <DropdownMenu.Item
                  onSelect={() => {
                    setShowEditPlaylistModal(true);
                  }}
                >
                  Edit
                </DropdownMenu.Item>
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
          {/*    <DropdownMenu.CheckboxItem> */}
          {/*      <DropdownMenu.ItemIndicator /> */}
          {/*    </DropdownMenu.CheckboxItem> */}

          {/*    <DropdownMenu.RadioGroup> */}
          {/*      <DropdownMenu.RadioItem> */}
          {/*        <DropdownMenu.ItemIndicator /> */}
          {/*      </DropdownMenu.RadioItem> */}
          {/*    </DropdownMenu.RadioGroup> */}

          {/*    <DropdownMenu.Sub> */}
          {/*      <DropdownMenu.SubTrigger /> */}
          {/*      <DropdownMenu.Portal> */}
          {/*        <DropdownMenu.SubContent /> */}
          {/*      </DropdownMenu.Portal> */}
          {/*    </DropdownMenu.Sub> */}

          {/*    <DropdownMenu.Separator /> */}
          {/*    <DropdownMenu.Arrow /> */}
          {/*  </DropdownMenu.Content> */}
          {/* </DropdownMenu.Portal> */}
        </DropdownMenu.Root>
      </div>
      {showEditPlaylistModal && (
        <div className={s.playlistModalWrapper}>
          <EditPlaylistModal
            playlist={playlist}
            onCancel={() => setShowEditPlaylistModal(false)}
            onSuccess={handleEditPlaylistSuccess}
            onError={handleEditPlaylistError}
          />
        </div>
      )}
    </>
  );
};
