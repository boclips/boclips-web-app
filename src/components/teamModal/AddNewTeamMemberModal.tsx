import React, { useEffect, useRef, useState } from 'react';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { InputText } from '@boclips-ui/input';
import { useAddNewUser, useGetUserQuery } from 'src/hooks/api/userQuery';
import {
  CreateUserRequest,
  UserType,
} from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { User } from 'boclips-api-client/dist/sub-clients/users/model/User';
import { Typography } from '@boclips-ui/typography';
import { UserRole } from 'boclips-api-client/dist/sub-clients/users/model/UserRole';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import * as RadioGroup from '@radix-ui/react-radio-group';
import s from 'src/components/common/yesNo/style.module.less';
import { toTitleCase } from 'src/views/support/toTitleCase';

type Props = {
  product: Product;
  closeModal: () => void;
};

type NewUserForm = {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
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

const AddNewTeamMemberModal = ({ product, closeModal }: Props) => {
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
      type: UserType.webAppUser,
      userRoles: {
        [product]: form?.role,
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

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const getRolesForProduct = (product: Product) => {
    if (product === Product.LIBRARY) {
      return [UserRole.ADMIN, UserRole.ORDER_MANAGER, UserRole.VIEWER];
    }
    return [UserRole.ADMIN, UserRole.TEACHER];
  };

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
      <div className="my-4">
        <Typography.Body className="text-gray-800">User role</Typography.Body>
      </div>
      <RadioGroup.Root
        className={s.radioGroupRoot}
        orientation="horizontal"
        onValueChange={(value: UserRole) => setForm({ ...form, role: value })}
        defaultValue={
          product === Product.CLASSROOM ? UserRole.TEACHER : UserRole.VIEWER
        }
      >
        {getRolesForProduct(product).map((role) => {
          return (
            <div className={s.radioGroupItemWrapper}>
              <RadioGroup.Item
                className={s.radioGroupItem}
                value={role}
                id={role.toLowerCase()}
                aria-label={`${role} role`}
              >
                <RadioGroup.Indicator className={s.radioGroupIndicator} />
              </RadioGroup.Item>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor={role.toLowerCase()}>
                <Typography.Body as="span" className={s.radioItemLabel}>
                  {toTitleCase(role)}
                </Typography.Body>
              </label>
            </div>
          );
        })}
      </RadioGroup.Root>
    </Bodal>
  );
};

export default AddNewTeamMemberModal;
