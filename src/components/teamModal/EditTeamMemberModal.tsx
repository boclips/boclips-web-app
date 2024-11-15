import React, { useEffect, useState } from 'react';
import { Bodal } from '@src/components/common/bodal/Bodal';
import { EditUserRequest, useUpdateUser } from '@src/hooks/api/userQuery';
import {
  UpdateUserRequest,
  UserType,
} from 'boclips-api-client/dist/sub-clients/users/model/UpdateUserRequest';
import { displayNotification } from '@src/components/common/notification/displayNotification';
import YesNo from '@src/components/common/yesNo/YesNo';
import { Typography } from '@boclips-ui/typography';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import { FeatureGate } from '@src/components/common/FeatureGate';

type Props = {
  userToUpdate: AccountUser;
  closeModal: () => void;
};

type EditUserForm = {
  canOrder?: boolean;
  canManageUsers?: boolean;
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

const EditTeamMemberModal = ({ userToUpdate, closeModal }: Props) => {
  const [form, setForm] = useState<EditUserForm | null>(null);
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

  const handleConfirm = () => {
    const request: UpdateUserRequest = {
      type: UserType.b2bUser,
      permissions: {
        canOrder: form?.canOrder,
        canManageUsers: form?.canManageUsers,
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
        <Typography.Body className="text-gray-800">
          Team member actions
        </Typography.Body>
      </div>
      <YesNo
        id="user-management-permission"
        label="Can manage team?"
        defaultValue={userToUpdate.permissions?.canManageUsers}
        onValueChange={(value) => {
          setForm({ ...form, canManageUsers: value });
        }}
      />
      <FeatureGate linkName="order">
        <YesNo
          id="ordering-permission"
          label="Can order videos?"
          defaultValue={userToUpdate.permissions?.canOrder}
          onValueChange={(value) => {
            setForm({ ...form, canOrder: value });
          }}
        />
      </FeatureGate>
    </Bodal>
  );
};

export default EditTeamMemberModal;
