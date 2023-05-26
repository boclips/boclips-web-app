import React, { ReactElement } from 'react';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import { Typography } from '@boclips-ui/typography';
import c from 'classnames';
import s from './style.module.less';

interface UserInformationFieldProps {
  fieldName: string;
  children: ReactElement | string;
}

const UserInformationField = ({
  fieldName,
  children,
}: UserInformationFieldProps) => {
  return (
    <div className={s.listItem} data-qa={`user-info-field-${fieldName}`}>
      <Typography.Body
        as="div"
        size="small"
        weight="medium"
        className="text-gray-700"
      >
        {fieldName}
      </Typography.Body>
      {children}
    </div>
  );
};

export interface Props {
  user: AccountUser;
  isLoading?: boolean;
}

export const UsersListItem = ({ user, isLoading }: Props) => {
  return (
    <li
      data-qa={isLoading ? 'skeleton' : ''}
      className={c({ [s.skeleton]: isLoading }, s.listItemWrapper)}
    >
      <UserInformationField fieldName="User">
        <Typography.Body size="small" as="span">
          {user.firstName} {user.lastName}
        </Typography.Body>
      </UserInformationField>
      <UserInformationField fieldName="User email">
        <Typography.Body size="small" as="span">
          {user.email}
        </Typography.Body>
      </UserInformationField>
      <UserInformationField fieldName="Can order">
        <Typography.Body size="small" as="span">
          {user.permissions?.canOrder ? 'Yes' : 'No'}{' '}
        </Typography.Body>
      </UserInformationField>
      <UserInformationField fieldName="Can add users">
        <Typography.Body size="small" as="span">
          {user.permissions?.canManageUsers ? 'Yes' : 'No'}{' '}
        </Typography.Body>
      </UserInformationField>
    </li>
  );
};
