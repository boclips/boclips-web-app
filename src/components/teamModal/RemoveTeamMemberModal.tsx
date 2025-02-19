import React, { useEffect } from 'react';
import { Typography } from '@boclips-ui/typography';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import { EditUserRequest, useUpdateUser } from 'src/hooks/api/userQuery';
import { UpdateUserRequest } from 'boclips-api-client/dist/sub-clients/users/model/UpdateUserRequest';
import { displayNotification } from 'src/components/common/notification/displayNotification';

interface Props {
  user: AccountUser;
  closeModal: () => void;
}

const successNotification = (request: EditUserRequest) =>
  displayNotification(
    'success',
    `User removed successfully`,
    `Removed user — ${request.user.email}`,
    `user-removed-${request.user.email}`,
  );

const errorNotification = (errorMessage: string, request: EditUserRequest) => {
  return displayNotification(
    'error',
    `User removal failed`,
    `Failed to remove user — ${request.user.email} ${errorMessage}`,
    `user-removal-failed-${request.user.email}`,
  );
};

export const RemoveTeamMemberModal = ({ user, closeModal }: Props) => {
  const {
    mutate: updateUser,
    isLoading: isRemoveUserLoading,
    isSuccess: isRemoveUserSuccess,
  } = useUpdateUser();

  useEffect(() => {
    if (isRemoveUserSuccess) {
      closeModal();
    }
  }, [closeModal, isRemoveUserSuccess]);

  const handleConfirm = () => {
    const request: UpdateUserRequest = {
      disabled: true,
    };

    updateUser(
      { user, request },
      {
        onSuccess: (
          isSuccessFullyRemoved: boolean,
          editRequest: EditUserRequest,
        ) => {
          if (isSuccessFullyRemoved) {
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
      title="Remove user from Team Accounts"
      onConfirm={handleConfirm}
      onCancel={closeModal}
      confirmButtonText="Yes, I confirm"
      isLoading={isRemoveUserLoading}
      displayCancelButton={false}
    >
      <Typography.Body as="p">
        You are about to remove{' '}
        <Typography.Body className="text-gray-800" weight="medium">
          {user?.firstName} {user?.lastName}
        </Typography.Body>{' '}
        using{' '}
        <Typography.Body className="text-gray-800" weight="medium">
          {user?.email}
        </Typography.Body>
      </Typography.Body>
    </Bodal>
  );
};
