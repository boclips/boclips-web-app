import React, { ReactElement } from 'react';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import { Typography } from '@boclips-ui/typography';
import c from 'classnames';
import Button from '@boclips-ui/button';
import PencilSVG from 'src/resources/icons/pencil.svg';
import BinSVG from 'src/resources/icons/bin.svg';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { toTitleCase } from 'src/views/support/toTitleCase';
import s from './style.module.less';

interface UserInformationFieldProps {
  name: string;
  value: ReactElement | string;
}

export interface Props {
  user: AccountUser;
  product: Product;
  isLoading?: boolean;
  onEdit: (user: AccountUser) => void;
  canEdit: boolean;
  onRemove: (user: AccountUser) => void;
  canRemove: boolean;
  displayAccount: boolean;
  iconOnlyButtons: boolean;
}

export const UsersListItem = ({
  user,
  product,
  isLoading,
  onEdit,
  canEdit,
  onRemove,
  canRemove,
  displayAccount,
  iconOnlyButtons,
}: Props) => {
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
      {displayAccount && (
        <UserInformationField
          name={product === Product.CLASSROOM ? 'District/School' : 'Account'}
          value={user.account?.name}
        />
      )}
      <UserInformationField
        name="Role"
        value={toTitleCase(user.userRoles?.[product])}
      />

      <ActionButtons
        user={user}
        onRemove={onRemove}
        canRemove={canRemove}
        canEdit={canEdit}
        onEdit={onEdit}
        iconOnlyButtons={iconOnlyButtons}
      />
    </li>
  );
};

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

const ActionButtons = ({
  canEdit,
  onEdit,
  user,
  canRemove,
  onRemove,
  iconOnlyButtons,
}: Partial<Props>) => {
  return (
    <div className={c(s.listItem, s.buttons)}>
      {canEdit && (
        <FeatureGate fallback={null} linkName="updateUser">
          <Button
            onClick={() => onEdit(user)}
            className={s.editButton}
            text="Edit"
            aria-label="Edit"
            icon={<PencilSVG aria-hidden />}
            iconOnly={iconOnlyButtons}
            type="outline"
            height="42px"
          />
        </FeatureGate>
      )}

      {canRemove && (
        <FeatureGate fallback={null} linkName="deleteUser">
          <Button
            onClick={() => onRemove(user)}
            className={s.editButton}
            text="Remove"
            aria-label="Remove"
            icon={<BinSVG aria-hidden />}
            iconOnly={iconOnlyButtons}
            height="42px"
            type="label"
          />
        </FeatureGate>
      )}
    </div>
  );
};
