import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import s from '@components/playlistModal/style.module.less';
import { Bodal } from '@components/common/bodal/Bodal';
import { Dropdown, Typography } from 'boclips-ui';
import CopyLinkIcon from '@resources/icons/copy-link-icon.svg?react';
import React from 'react';
import { CollectionPermission } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionPermissions';
import { useUpdatePlaylistPermissionsMutation } from '@src/hooks/api/playlistsQuery';

export interface Props {
  playlist: Collection;
  handleClick: () => void;
  onCancel: () => void;
  title?: string;
}

export const EditPlaylistPermissionsModal = ({
  playlist,
  handleClick,
  onCancel,
  title = 'Share this playlist',
}: Props) => {
  const { mutate: changePlaylistPermissions, isLoading } =
    useUpdatePlaylistPermissionsMutation(playlist);

  const handleUpdatePermissions = (permission: CollectionPermission) => {
    if (playlist.permissions.anyone !== permission) {
      changePlaylistPermissions(permission);
    }
  };

  const options = [
    {
      id: 'edit-permission-option',
      name: 'edit-permission-option',
      value: CollectionPermission.EDIT,
      'data-qa': 'edit-permission-option',
      label: 'can edit',
    },
    {
      id: 'view-permission-option',
      name: 'view-permission-option',
      value: CollectionPermission.VIEW_ONLY,
      'data-qa': 'view-permission-option',
      label: 'can view',
    },
  ];

  return (
    <div className={s.playlistModalWrapper}>
      <Bodal
        dataQa="playlist-permissions-modal"
        title={title}
        confirmButtonText="Copy link"
        onConfirm={handleClick}
        onCancel={onCancel}
        isLoading={isLoading}
        displayCancelButton={false}
        confirmButtonIcon={<CopyLinkIcon />}
      >
        <div className="flex flex-col">
          <Typography.Body className="mt-3">
            Select your sharing preference:
          </Typography.Body>
          <div className="flex flex-row items-end">
            <Typography.Body className="mt-6 mr-2">
              Anyone with the link {playlist.mine}
            </Typography.Body>
            <div className="w-32 h-10">
              <Dropdown
                dataQa="permission-dropdown"
                mode="single"
                fitWidth
                options={options}
                onUpdate={handleUpdatePermissions}
                placeholder={null}
                defaultValue={playlist.permissions.anyone}
              />
            </div>
          </div>
        </div>
      </Bodal>
    </div>
  );
};
