import React, { ReactElement, useCallback, useState } from 'react';
import { Typography } from '@boclips-ui/typography';
import { InputText } from '@boclips-ui/input';
import Button from '@boclips-ui/button';
import { useAddNewTrialUser } from 'src/hooks/api/userQuery';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import { LoadingOutlined } from '@ant-design/icons';
import c from 'classnames';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import s from './style.module.less';

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountName: string;
}

const RegistrationForm = () => {
  const { mutate: createTrialUser, isLoading: isTrialUserCreating } =
    useAddNewTrialUser();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return null;
    }

    const token = await executeRecaptcha('register');
    return token;
  }, [executeRecaptcha]);

  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountName: '',
  });

  const handleChange = (fieldName, value) => {
    if (!value) return;
    setRegistrationData((prevState) => {
      return {
        ...prevState,
        [fieldName]: value,
      };
    });
  };

  const handleUserCreation = async () => {
    const token = await handleReCaptchaVerify();
    createTrialUser(
      {
        email: registrationData.email,
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        password: registrationData.password,
        recaptchaToken: token,
        type: UserType.trialB2bUser,
        accountName: registrationData.accountName,
      },
      {
        onSuccess: (user: User) => {
          displayNotification(
            'success',
            `User ${user.email} successfully created`,
          );
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
        <InputText
          id="input-accountName"
          onChange={(value) => handleChange('accountName', value)}
          inputType="text"
          placeholder="Your account name"
          defaultValue={registrationData.firstName}
          className={s.input}
          labelText="Account name"
        />
        <div className="flex flex-row">
          <InputText
            id="input-firstName"
            onChange={(value) => handleChange('firstName', value)}
            inputType="text"
            placeholder="John"
            defaultValue={registrationData.firstName}
            className={c(s.input, 'flex-1 mr-4')}
            labelText="First name"
          />
          <InputText
            id="input-lastName"
            onChange={(value) => handleChange('lastName', value)}
            inputType="text"
            placeholder="Smith"
            className={c(s.input, 'flex-1')}
            labelText="Last name"
          />
        </div>
        <InputText
          id="input-email"
          onChange={(value) => handleChange('email', value)}
          inputType="text"
          placeholder="smith@gmail.com"
          className={c(s.input)}
          labelText="Email"
        />
        <div className="flex flex-row">
          <InputText
            id="input-password"
            onChange={(value) => handleChange('password', value)}
            inputType="password"
            placeholder="*********"
            className={c(s.input, 'flex-1 mr-4')}
            labelText="Password"
          />
          <InputText
            id="input-confirmPassword"
            onChange={(value) => handleChange('confirmPassword', value)}
            inputType="password"
            placeholder="*********"
            className={c(s.input, 'flex-1')}
            labelText="Confirm password"
          />
        </div>

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
