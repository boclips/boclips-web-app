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
  const confirmPassRef = useRef(null);

  const handleChange = (fieldName, value) => {
    if (!value) return;
    setRegistrationData((prevState) => {
      return {
        ...prevState,
        [fieldName]: value,
      };
    });
  };

  const clear = () => {
    firstNameRef.current.value = '';
    lastNameRef.current.value = '';
    emailRef.current.value = '';
    passwordRef.current.value = '';
    confirmPassRef.current.value = '';
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
          clear();
        },
        onError: () => {
          displayNotification('error', 'User creation failed');
        },
      },
    );
  };

  const getButtonSpinner = (): ReactElement =>
    isTrialUserCreating ? (
      <span data-qa="spinner" className={s.spinner}>
        <LoadingOutlined />
      </span>
    ) : null;

  return (
    <>
      <section className={s.formHeader}>
        <Typography.H1>CourseSpark</Typography.H1>
        <Typography.Body weight="medium" className={s.blueText}>
          Create new account
        </Typography.Body>
        <Typography.Body size="small" className={s.blueText}>
          30 day trial
        </Typography.Body>
      </section>
      <main tabIndex={-1} className={s.formInputsWrapper}>
        <div className="flex flex-row">
          <InputText
            id="input-firstName"
            onChange={(value) => handleChange('firstName', value)}
            inputType="text"
            placeholder="John"
            defaultValue={registrationData.firstName}
            ref={firstNameRef}
            className={c(s.input, 'flex-1 mr-4')}
            labelText="First name"
          />
          <InputText
            id="input-lastName"
            onChange={(value) => handleChange('lastName', value)}
            inputType="text"
            placeholder="Smith"
            ref={lastNameRef}
            className={c(s.input, 'flex-1')}
            labelText="Last name"
          />
        </div>
        <InputText
          id="input-email"
          onChange={(value) => handleChange('email', value)}
          inputType="text"
          placeholder="smith@gmail.com"
          ref={emailRef}
          className={c(s.input)}
          labelText="Email"
        />
        <InputText
          id="input-password"
          onChange={(value) => handleChange('password', value)}
          inputType="password"
          placeholder="*********"
          ref={passwordRef}
          className={c(s.input)}
          labelText="Password"
        />
        <InputText
          id="input-confirmPassword"
          onChange={(value) => handleChange('confirmPassword', value)}
          inputType="password"
          placeholder="*********"
          ref={confirmPassRef}
          className={c(s.input)}
          labelText="Confirm password"
        />

        <Typography.Body size="small" className={c(s.blueText, 'mt-1')}>
          By clicking Create Account, you agree to the Boclips User Agreement,
          Privacy Policy, and Cookie Policy.
        </Typography.Body>
      </main>
      <section className={s.createAccountButtonWrapper}>
        <Button
          onClick={handleUserCreation}
          text="Create Account"
          disabled={isTrialUserCreating}
          icon={getButtonSpinner()}
          className={s.createAccountButton}
        />
      </section>
    </>
  );
};

export default RegistrationForm;
