import { User } from 'boclips-api-client/dist/sub-clients/users/model/User';
import { useUpdateSelfUser } from '@src/hooks/api/userQuery';
import { displayNotification } from '@src/components/common/notification/displayNotification';
import React, { useEffect, useRef, useState } from 'react';
import {
  UpdateUserRequest,
  UserType,
} from 'boclips-api-client/dist/sub-clients/users/model/UpdateUserRequest';
import { Bodal } from '@src/components/common/bodal/Bodal';
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
    `Your profile has been changed successfully`,
    '',
    `user-edited-${user.firstName}`,
  );

const errorNotification = (errorMessage: string, user: User) => {
  return displayNotification(
    'error',
    `Your profile could not be edited`,
    `${errorMessage}`,
    `user-editing-failed-${user.firstName}`,
  );
};

const EditPersonalProfileModal = ({ userToUpdate, closeModal }: Props) => {
  const [form, setForm] = useState<EditPersonalProfileForm | null>({
    firstName: userToUpdate.firstName,
    lastName: userToUpdate.lastName,
  });
  const {
    mutate: updateSelfUser,
    isLoading: isEditSelfUserLoading,
    isSuccess: isEditSelfUserSuccess,
  } = useUpdateSelfUser();

  useEffect(() => {
    if (isEditSelfUserSuccess) {
      closeModal();
    }
  }, [closeModal, isEditSelfUserSuccess]);
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

    updateSelfUser(
      { user: userToUpdate, request },
      {
        onSuccess: (updatedUser: User) => {
          successNotification(updatedUser);
          closeModal();
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
      isLoading={isEditSelfUserLoading}
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
