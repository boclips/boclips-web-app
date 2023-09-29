import React, { ReactElement, useRef, useState } from 'react';
import { Typography } from '@boclips-ui/typography';
import { InputText } from '@boclips-ui/input';
import Button from '@boclips-ui/button';
import { useAddNewTrialUser } from 'src/hooks/api/userQuery';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import { LoadingOutlined } from '@ant-design/icons';
import c from 'classnames';
import s from './style.module.less';

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegistrationForm = () => {
  const { mutate: createTrialUser, isLoading: isTrialUserCreating } =
    useAddNewTrialUser();

  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleChange = (fieldName, value) => {
    if (!value) return;
    setRegistrationData((prevState) => {
      return {
        ...prevState,
        [fieldName]: value,
      };
    });
  };

  const handleUserCreation = () => {
    createTrialUser(
      {
        email: registrationData.email,
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        password: registrationData.password,
        type: UserType.trialB2bUser,
      },
      {
        onSuccess: (user: User) => {
          displayNotification(
            'success',
            `User ${user.email} successfully created`,
          );
          clearInputs();
        },
        onError: () => displayNotification('error', 'User creation failed'),
      },
    );
  };

  const clearInputs = () => {
    firstNameRef.current.value = '';
    lastNameRef.current.value = '';
    emailRef.current.value = '';
    passwordRef.current.value = '';
    confirmPasswordRef.current.value = '';
  };

  const getSpinner = (): ReactElement =>
    isTrialUserCreating ? (
      <span data-qa="spinner" className={s.spinner}>
        <LoadingOutlined />
      </span>
    ) : null;
  return (
    <>
      <section className={s.formHeader}>
        <Typography.H1>CourseSpark</Typography.H1>
        <Typography.Body weight="medium" className="text-blue-700">
          Create new account
        </Typography.Body>
        <Typography.Body size="small" className="text-blue-700">
          30 day trial
        </Typography.Body>
      </section>
      <main tabIndex={-1} className={s.formInputsWrapper}>
        <div className="flex flex-row">
          <InputText
            id="input-first-name"
            onChange={(value) => handleChange('firstName', value)}
            inputType="text"
            placeholder="Your First name*"
            ref={firstNameRef}
            className={c(s.input, 'flex-1')}
          />
          <InputText
            id="input-last-name"
            onChange={(value) => handleChange('lastName', value)}
            inputType="text"
            placeholder="Your Last name*"
            ref={lastNameRef}
            className={c(s.input, 'flex-1', 'ml-3')}
          />
        </div>
        <InputText
          id="input-email"
          onChange={(value) => handleChange('email', value)}
          inputType="email"
          placeholder="Your Professional Email*"
          ref={emailRef}
          className={s.input}
        />
        <InputText
          id="input-password"
          onChange={(value) => handleChange('password', value)}
          inputType="text"
          placeholder="Password*"
          ref={passwordRef}
          className={s.input}
        />
        <InputText
          id="input-confirm-password"
          onChange={(value) => handleChange('confirmPassword', value)}
          inputType="text"
          placeholder="Confirm Password*"
          ref={confirmPasswordRef}
          className={s.input}
        />
        <Typography.Body size="small" className="mt-1 text-blue-700">
          By clicking Create Account, you agree to the Boclips User Agreement,
          Privacy Policy, and Cookie Policy.
        </Typography.Body>
      </main>
      <section className={s.createAccountButtonWrapper}>
        <Button
          onClick={handleUserCreation}
          text="Create Account"
          disabled={isTrialUserCreating}
          icon={getSpinner()}
          className={s.createAccountButton}
        />
      </section>
    </>
  );
};

export default RegistrationForm;
