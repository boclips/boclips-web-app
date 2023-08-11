import React, { useEffect, useRef, useState } from 'react';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { InputText } from '@boclips-ui/input';
import { useAddNewUser, useGetUserQuery } from 'src/hooks/api/userQuery';
import {
  CreateUserRequest,
  UserType,
} from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import YesNo from 'src/components/common/yesNo/YesNo';
import { ROLES } from 'src/types/Roles';
import { WithValidRoles } from 'src/components/common/errors/WithValidRoles';
import { Typography } from '@boclips-ui/typography';

type Props = {
  closeModal: () => void;
};

type NewUserForm = {
  firstName?: string;
  lastName?: string;
  email?: string;
  canOrder?: boolean;
  canManageUsers?: boolean;
};

const successNotification = (userRequest: User) =>
  displayNotification(
    'success',
    `User created successfully`,
    `Created a new user — ${userRequest.firstName} ${userRequest.lastName}`,
    `user-created-${userRequest.id}`,
  );

const errorNotification = (
  errorMessage: string,
  userRequest: CreateUserRequest,
) => {
  return displayNotification(
    'error',
    `User creation failed`,
    `Failed to create a new user — ${errorMessage}`,
    `user-creation-failed-${userRequest.email}`,
  );
};

const AddNewTeamMemberModal = ({ closeModal }: Props) => {
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
  const isFormIncomplete = () =>
    !form?.firstName?.length || !form?.lastName?.length || !form?.email?.length;

  useEffect(() => {
    if (isCreateUserSuccess) {
      closeModal();
    }
  }, [closeModal, isCreateUserSuccess]);

  const handleConfirm = () => {
    if (!formIsValid() || isFormIncomplete()) {
      return;
    }

    const request: CreateUserRequest = {
      firstName: form?.firstName,
      lastName: form?.lastName,
      email: form?.email,
      accountId: user?.account?.id,
      type: UserType.b2bUser,
      permissions: {
        canOrder: form?.canOrder,
        canManageUsers: form?.canManageUsers,
      },
    };

    createUser(request, {
      onSuccess: (createdUser: User) => {
        successNotification(createdUser);
        closeModal();
      },
      onError: (error: Error, userRequest: CreateUserRequest) => {
        errorNotification(error.message, userRequest);
      },
    });
  };

  const validateTextField = (fieldName: string) =>
    form[fieldName]?.length < 2
      ? setIsError({ ...isError, [fieldName]: true })
      : setIsError({ ...isError, [fieldName]: false });

  return (
    <Bodal
      closeOnClickOutside
      title="Add member"
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
        className="mb-6"
        id="email"
        onChange={(e) => setForm({ ...form, email: e })}
        inputType="email"
        placeholder="example@email.com"
        isError={isError.email}
        onBlur={() => validateTextField('email')}
        errorMessage="Please enter a valid email address"
      />
      <div className="mb-4">
        <Typography.Body className="text-gray-800">
          User permissions
        </Typography.Body>
      </div>
      <YesNo
        id="user-management-permission"
        label="Can manage users?"
        onValueChange={(value) => {
          setForm({ ...form, canManageUsers: value });
        }}
      />
      <WithValidRoles roles={[ROLES.BOCLIPS_WEB_APP_ORDER]}>
        <YesNo
          id="ordering-permission"
          label="Can order?"
          onValueChange={(value) => {
            setForm({ ...form, canOrder: value });
          }}
        />
      </WithValidRoles>
    </Bodal>
  );
};

export default AddNewTeamMemberModal;
