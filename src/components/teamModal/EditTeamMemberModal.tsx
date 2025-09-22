import React, { useEffect, useState } from 'react';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { EditUserRequest, useUpdateUser } from 'src/hooks/api/userQuery';
import { UpdateUserRequest } from 'boclips-api-client/dist/sub-clients/users/model/UpdateUserRequest';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { Typography } from '@boclips-ui/typography';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import * as RadioGroup from '@radix-ui/react-radio-group';
import s from 'src/components/common/yesNo/style.module.less';
import { UserRole } from 'boclips-api-client/dist/sub-clients/users/model/UserRole';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { toTitleCase } from 'src/views/support/toTitleCase';

type Props = {
  userToUpdate: AccountUser;
  product: Product;
  closeModal: () => void;
};

const successNotification = (request: EditUserRequest) =>
  displayNotification(
    'success',
    `User edited successfully`,
    `Edited user — ${request.user.firstName} ${request.user.lastName}`,
    `user-edited-${request.user.email}`,
  );

const errorNotification = (errorMessage: string, request: EditUserRequest) => {
  return displayNotification(
    'error',
    `User editing failed`,
    `Failed to edit user — ${request.user.firstName} ${request.user.lastName} ${errorMessage}`,
    `user-editing-failed-${request.user.email}`,
  );
};

interface ReadOnlyUserInfoProps {
  label: string;
  value: string;
}
const ReadOnlyUserInfo = ({ label, value }: ReadOnlyUserInfoProps) => {
  return (
    <>
      <div className="mb-1">
        <Typography.Body className="text-gray-800">{label}</Typography.Body>
      </div>
      <div className="mb-1">
        <Typography.Body weight="medium" className="text-gray-800">
          {value}
        </Typography.Body>
      </div>
    </>
  );
};

const EditTeamMemberModal = ({ userToUpdate, product, closeModal }: Props) => {
  const {
    mutate: updateUser,
    isLoading: isEditUserLoading,
    isSuccess: isEditUserSuccess,
  } = useUpdateUser();

  useEffect(() => {
    if (isEditUserSuccess) {
      closeModal();
    }
  }, [closeModal, isEditUserSuccess]);

  const [role, setRole] = useState<UserRole>(userToUpdate.userRoles?.[product]);

  const handleConfirm = () => {
    const request: UpdateUserRequest = {
      userRoles: {
        ...userToUpdate.userRoles,
        [product]: role,
      },
    };

    updateUser(
      { user: userToUpdate, request },
      {
        onSuccess: (
          isSuccessfullyEdited: boolean,
          editRequest: EditUserRequest,
        ) => {
          if (isSuccessfullyEdited) {
            successNotification(editRequest);
            closeModal();
          } else {
            errorNotification('Unknown error', editRequest);
          }
        },
        onError: (error: Error, editRequest: EditUserRequest) => {
          errorNotification(error.message, editRequest);
        },
      },
    );
  };

  const getRolesForProduct = () => {
    if (product === Product.LIBRARY) {
      return [UserRole.ADMIN, UserRole.ORDER_MANAGER, UserRole.VIEWER];
    }
    return [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT];
  };

  return (
    <Bodal
      closeOnClickOutside
      title="Edit user"
      onConfirm={handleConfirm}
      onCancel={closeModal}
      confirmButtonText="Save"
      isLoading={isEditUserLoading}
    >
      <ReadOnlyUserInfo label="First name" value={userToUpdate.firstName} />
      <ReadOnlyUserInfo label="Last name" value={userToUpdate.lastName} />
      <ReadOnlyUserInfo label="Email address" value={userToUpdate.email} />
      <div className="my-4">
        <Typography.Body className="text-gray-800">User role</Typography.Body>
      </div>
      <RadioGroup.Root
        className={s.radioGroupRoot}
        orientation="horizontal"
        onValueChange={(value: UserRole) => setRole(value)}
        defaultValue={role}
      >
        {getRolesForProduct().map((userRole) => {
          return (
            <div className={s.radioGroupItemWrapper}>
              <RadioGroup.Item
                className={s.radioGroupItem}
                value={userRole}
                id={userRole.toLowerCase()}
                aria-label={`${userRole} role`}
              >
                <RadioGroup.Indicator className={s.radioGroupIndicator} />
              </RadioGroup.Item>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor={userRole.toLowerCase()}>
                <Typography.Body as="span" className={s.radioItemLabel}>
                  {toTitleCase(userRole)}
                </Typography.Body>
              </label>
            </div>
          );
        })}
      </RadioGroup.Root>
    </Bodal>
  );
};

export default EditTeamMemberModal;
