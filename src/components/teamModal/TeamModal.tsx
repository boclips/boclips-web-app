import React, { useEffect, useRef, useState } from 'react';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { InputText } from '@boclips-ui/input';
import { useAddNewUser, useGetUserQuery } from 'src/hooks/api/userQuery';
import {
  CreateUserRequest,
  UserType,
} from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { AccountUserStatus } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

type Props = {
  closeModal: () => void;
};

type NewUserForm = {
  firstName: string;
  lastName: string;
  email: string;
  accountId: string;
};
const TeamModal = ({ closeModal }: Props) => {
  const { data: user, isLoading: isLoadingUser } = useGetUserQuery();
  const [form, setForm] = useState<NewUserForm | null>(null);
  const {
    mutate: createUser,
    isLoading: isCreateUserLoading,
    isSuccess: isCreateUserSuccess,
  } = useAddNewUser();

  const [isError, setIsError] = useState({
    firstName: false,
    lastName: false,
    email: false,
  });

  const firstInputRef = useRef();

  const formIsValid = () => Object.values(isError).every((e) => !e);

  useEffect(() => {
    if (isCreateUserSuccess) {
      closeModal();
    }
  }, [isCreateUserSuccess]);

  const handleConfirm = () => {
    if (!formIsValid()) {
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

export default TeamModal;
