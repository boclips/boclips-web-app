import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import { useUpdateUser } from 'src/hooks/api/userQuery';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import React, { useEffect, useRef, useState } from 'react';
import {
  UpdateUserRequest,
  UserType,
} from 'boclips-api-client/dist/sub-clients/users/model/UpdateUserRequest';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { InputText } from '@boclips-ui/input';

type Props = {
  userToUpdate: User;
  closeModal: () => void;
};

type EditPersonalProfileForm = {
  firstName?: string;
  lastName?: string;
};

const successNotification = (user: User) =>
  displayNotification(
    'success',
    `User edited successfully`,
    `Edited user — ${user.firstName} ${user.lastName}`,
    `user-edited-${user.firstName}`,
  );

const errorNotification = (errorMessage: string, user: User) => {
  return displayNotification(
    'error',
    `User editing failed`,
    `Failed to edit user — ${user.firstName} ${user.lastName} ${errorMessage}`,
    `user-editing-failed-${user.firstName}`,
  );
};

const EditPersonalProfileModal = ({ userToUpdate, closeModal }: Props) => {
  const [form, setForm] = useState<EditPersonalProfileForm | null>({
    firstName: userToUpdate.firstName,
    lastName: userToUpdate.lastName,
  });
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
  const formIsValid = () => Object.values(isError).every((e) => !e);
  const handleConfirm = () => {
    if (!formIsValid()) {
      return;
    }

    const request: UpdateUserRequest = {
      firstName: form.firstName,
      lastName: form.lastName,
      type: UserType.b2bUser,
    };

    updateUser(
      { user: userToUpdate, request },
      {
        onSuccess: (isSuccessfullyEdited: boolean) => {
          if (isSuccessfullyEdited) {
            successNotification(userToUpdate);
            closeModal();
          } else {
            errorNotification('Unknown error', userToUpdate);
          }
        },
        onError: (error: Error) => {
          errorNotification(error.message, userToUpdate);
        },
      },
    );
  };
  const firstInputRef = useRef();

  const [isError, setIsError] = useState({
    firstName: false,
    lastName: false,
  });
  const validateTextField = (fieldName: string) =>
    form[fieldName]?.length < 2
      ? setIsError({ ...isError, [fieldName]: true })
      : setIsError({ ...isError, [fieldName]: false });

  return (
    <Bodal
      closeOnClickOutside
      title="Edit Personal Profile"
      onConfirm={handleConfirm}
      onCancel={closeModal}
      confirmButtonText="Save"
      isLoading={isEditUserLoading}
    >
      <InputText
        ref={firstInputRef}
        showLabelText
        inputType="text"
        id="first-name"
        onChange={(e) => setForm({ ...form, firstName: e })}
        placeholder="John"
        defaultValue={userToUpdate.firstName}
        labelText="First name"
        className="mb-6"
        isError={isError.firstName}
        onBlur={() => validateTextField('firstName')}
        errorMessage="Please enter a valid first name (2 characters or longer)"
      />
      <InputText
        inputType="text"
        id="last-name"
        onChange={(e) => setForm({ ...form, lastName: e })}
        placeholder="Smith"
        defaultValue={userToUpdate.lastName}
        showLabelText
        labelText="Last name"
        className="mb-6"
        isError={isError.lastName}
        onBlur={() => validateTextField('lastName')}
        errorMessage="Please enter a valid last name (2 characters or longer)"
      />
    </Bodal>
  );
};

export default EditPersonalProfileModal;
