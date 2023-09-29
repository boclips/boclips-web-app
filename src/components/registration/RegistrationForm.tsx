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

  const textInput = (
    name: string,
    ref: React.MutableRefObject<HTMLInputElement>,
    placeholder: string,
    additionalStyles?: string,
  ) => input(name, ref, placeholder, 'text', additionalStyles);

  const emailInput = (
    name: string,
    ref: React.MutableRefObject<HTMLInputElement>,
    placeholder: string,
    additionalStyles?: string,
  ) => input(name, ref, placeholder, 'email', additionalStyles);

  const input = (
    name: string,
    ref: React.MutableRefObject<HTMLInputElement>,
    placeholder: string,
    type: string,
    additionalStyles?: string,
  ) => (
    <InputText
      id={`input-${name}`}
      onChange={(value) => handleChange(name, value)}
      inputType={type === 'email' ? 'email' : 'text'}
      placeholder={placeholder}
      ref={ref}
      className={c(s.input, additionalStyles)}
    />
  );

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
          {textInput('firstName', firstNameRef, 'Your First name*', 'flex-1')}
          {textInput('lastName', lastNameRef, 'Your Last name*', 'flex-1 ml-3')}
        </div>
        {emailInput('email', emailRef, 'Your Professional Email*')}
        {textInput('password', passwordRef, 'Password*')}
        {textInput('confirmPassword', confirmPasswordRef, 'Confirm Password*')}

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
          icon={getSpinner()}
          className={s.createAccountButton}
        />
      </section>
    </>
  );
};

export default RegistrationForm;
