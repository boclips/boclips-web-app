import React, { ReactElement } from 'react';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import { Typography } from '@boclips-ui/typography';
import c from 'classnames';
import Button from '@boclips-ui/button';
import PencilSVG from 'src/resources/icons/pencil.svg';
import { ROLES } from 'src/types/Roles';
import { WithValidRoles } from 'src/components/common/errors/WithValidRoles';
import { AccountStatus } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import BinSVG from 'src/resources/icons/bin.svg';
import s from './style.module.less';

interface UserInformationFieldProps {
  name: string;
  value: ReactElement | string;
}

const UserInformationField = ({ name, value }: UserInformationFieldProps) => (
  <div className={s.listItem} data-qa={`user-info-field-${name}`}>
    <Typography.Body
      as="div"
      size="small"
      weight="medium"
      className="text-gray-700"
    >
      {name}
    </Typography.Body>
    <Typography.Body size="small" as="span">
      {value}
    </Typography.Body>
  </div>
);

export interface Props {
  user: AccountUser;
  accountStatus: AccountStatus;
  isLoading?: boolean;
  onEdit: (user: AccountUser) => void;
  canEdit: boolean;
  onRemove: (user: AccountUser) => void;
  canRemove: boolean;
}

export const UsersListItem = ({
  user,
  isLoading,
  onEdit,
  canEdit,
  accountStatus,
  onRemove,
  canRemove,
}: Props) => {
  const isNotTrial = accountStatus !== AccountStatus.TRIAL;

  const renderPermission = (permission: boolean) => (permission ? 'Yes' : 'No');

  return (
    <li
      data-qa={isLoading ? 'skeleton' : ''}
      className={c({ [s.skeleton]: isLoading }, s.listItemWrapper)}
    >
      <UserInformationField
        name="Name"
        value={`${user.firstName} ${user.lastName}`}
      />
      <UserInformationField name="Email address" value={user.email} />
      {isNotTrial && (
        <UserInformationField
          name="Can order videos"
          value={renderPermission(user.permissions?.canOrder)}
        />
      )}
      <UserInformationField
        name="Can manage team"
        value={renderPermission(user.permissions?.canManageUsers)}
      />

      {canEdit && (
        <WithValidRoles
          fallback={null}
          roles={[ROLES.ROLE_BOCLIPS_WEB_APP_MANAGE_USERS]}
        >
          <Button
            onClick={() => onEdit(user)}
            className={s.editButton}
            text="Edit"
            icon={<PencilSVG aria-hidden />}
            type="outline"
            height="42px"
          />
        </WithValidRoles>
      )}

      {canRemove && (
        <WithValidRoles
          fallback={null}
          roles={[ROLES.ROLE_BOCLIPS_WEB_APP_MANAGE_USERS]}
        >
          <Button
            onClick={() => onRemove(user)}
            className={s.editButton}
            text="Remove"
            icon={<BinSVG aria-hidden />}
            height="42px"
            type="label"
          />
        </WithValidRoles>
      )}
    </li>
  );
};
