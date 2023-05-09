import React, { useEffect, useRef, useState } from 'react';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { InputText } from '@boclips-ui/input';
import { useAddNewUser, useGetUserQuery } from 'src/hooks/api/userQuery';
import {
  CreateUserRequest,
  UserType,
} from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { AccountUserStatus } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';

type Props = {
  closeModal: () => void;
};

type NewUserForm = {
  firstName: string;
  lastName: string;
  email: string;
  accountId: string;
};

const successNotification = (userRequest: User) =>
  displayNotification(
    'success',
    `User created successfully`,
    `Created a new user — ${userRequest.firstName} ${userRequest.lastName}`,
    `user-created-${userRequest.id}`,
  );

const errorNotification = (errorMessage: string, userRequest: User) => {
  return displayNotification(
    'error',
    `User creation failed`,
    `Failed to create a new user — ${errorMessage}`,
    `user-creation-failed-${userRequest.id}`,
  );
};

const AddNewTeamMemberModal = ({ closeModal }: Props) => {
  const { data: user, isLoading: isLoadingUser } = useGetUserQuery();
  const [form, setForm] = useState<NewUserForm | null>(null);
  const {
    mutate: createUser,
    isLoading: isCreateUserLoading,
    isSuccess: isCreateUserSuccess,
  } = useAddNewUser(successNotification, errorNotification);

  const [isError, setIsError] = useState({
    firstName: false,
    lastName: false,
    email: false,
  });

  const firstInputRef = useRef();
  const formIsValid = () => Object.values(isError).every((e) => !e);
  const isFormEmpty = () => Object.values(form).some((e) => e.length === 0);

  useEffect(() => {
    if (isCreateUserSuccess) {
      closeModal();
    }
  }, [closeModal, isCreateUserSuccess]);

  const handleConfirm = () => {
    if (!formIsValid() || isFormEmpty()) {
      return;
    }

    const request: CreateUserRequest = {
      ...form,
      accountId: user?.account?.id,
      type: UserType.b2bUser,
      permission: AccountUserStatus.VIEW_ONLY,
    };

    createUser(request);
  };

  const validateTextField = (fieldName: string) =>
    form[fieldName]?.length < 2
      ? setIsError({ ...isError, [fieldName]: true })
      : setIsError({ ...isError, [fieldName]: false });

  return (
    <Bodal
      closeOnClickOutside
      title="Add new user"
      onConfirm={handleConfirm}
      onCancel={closeModal}
      confirmButtonText="Create"
      isLoading={isLoadingUser || isCreateUserLoading}
      initialFocusRef={firstInputRef}
    >
      <InputText
        ref={firstInputRef}
        showLabelText
        inputType="text"
        id="first-name"
        onChange={(e) => setForm({ ...form, firstName: e })}
        placeholder="John"
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
        showLabelText
        labelText="Last name"
        className="mb-6"
        isError={isError.lastName}
        onBlur={() => validateTextField('lastName')}
        errorMessage="Please enter a valid last name (2 characters or longer)"
      />
      <InputText
        showLabelText
        labelText="Email address"
        id="email"
        onChange={(e) => setForm({ ...form, email: e })}
        inputType="email"
        placeholder="example@email.com"
        isError={isError.email}
        onBlur={() => validateTextField('email')}
        errorMessage="Please enter a valid email address"
      />
    </Bodal>
  );
};

export default AddNewTeamMemberModal;
