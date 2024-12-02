import React, { useRef, useState } from 'react';
import { Typography } from 'boclips-ui';
import { useAddNewTrialUser } from '@src/hooks/api/userQuery';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { displayNotification } from '@src/components/common/notification/displayNotification';
import { User } from 'boclips-api-client/dist/sub-clients/users/model/User';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import RegistrationFormFields from '@src/components/registration/registrationForm/registrationFormFields/RegistrationFormFields';
import CreateAccountButton from '@src/components/registration/registrationForm/createAccountButton/CreateAccountButton';
import FormValidator from '@src/components/registration/registrationForm/validation/validation';
import { Link } from 'react-router-dom';
import s from '../style.module.less';

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountName: string;
  country: string;
  hasAcceptedEducationalUseTerms: boolean;
  hasAcceptedTermsAndConditions: boolean;
}

const emptyRegistrationData = (): RegistrationData => {
  return {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountName: '',
    country: '',
    hasAcceptedEducationalUseTerms: false,
    hasAcceptedTermsAndConditions: false,
  };
};

interface RegistrationFormProps {
  onRegistrationFinished: (userEmail: string) => void;
}

const RegistrationForm = ({
  onRegistrationFinished,
}: RegistrationFormProps) => {
  const { mutate: createTrialUser, isLoading: isTrialUserCreating } =
    useAddNewTrialUser();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptchaVerify = async () => {
    if (!executeRecaptcha) {
      throw new Error('Execute recaptcha not yet available');
    }
    return executeRecaptcha('register');
  };

  const [registrationData, setRegistrationData] = useState<RegistrationData>(
    emptyRegistrationData(),
  );

  const [validationErrors, setValidationErrors] = useState<RegistrationData>(
    emptyRegistrationData(),
  );

  const handleChange = (
    fieldName: string,
    value: string | boolean | string[],
  ) => {
    setRegistrationData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  async function tryHandleReCaptchaVerify() {
    try {
      return await handleReCaptchaVerify();
    } catch (e) {
      displayNotification(
        'error',
        'There was an error with our security verification. Please try again later.',
      );
      console.error(e);
      return null;
    }
  }

  const setError = (fieldName: string, value: boolean | string) => {
    setValidationErrors((prevState) => ({ ...prevState, [fieldName]: value }));
  };

  const clearError = (fieldName: string) => {
    setError(fieldName, '');
  };

  const handleUserCreation = async () => {
    const token = await tryHandleReCaptchaVerify();
    const isFormValid = new FormValidator(registrationData, setError).isValid();

    if (isFormValid && token) {
      createTrialUser(
        {
          email: registrationData.email,
          firstName: registrationData.firstName,
          lastName: registrationData.lastName,
          password: registrationData.password,
          recaptchaToken: token,
          type: UserType.trialB2bUser,
          accountName: registrationData.accountName,
          country: registrationData.country,
          hasAcceptedEducationalUseTerms:
            registrationData.hasAcceptedEducationalUseTerms,
          hasAcceptedTermsAndConditions:
            registrationData.hasAcceptedTermsAndConditions,
        },
        {
          onSuccess: (user: User) => {
            onRegistrationFinished(user.email);
          },
          onError: (error?: Error) => {
            const errorOrigin = error?.message?.split(' ')[0]?.toUpperCase();

            switch (errorOrigin) {
              case 'USER':
                setError('email', 'Email already exists');
                break;
              case 'ACCOUNT':
                setError(
                  'accountName',
                  'Cannot use this organization name. Try another or contact us.',
                );
                break;
              default:
                displayNotification(
                  'error',
                  'User creation failed',
                  error?.message,
                );
            }
          },
        },
      );
    }
  };

  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <main ref={mainRef} tabIndex={-1} className={s.formInputsWrapper}>
      <section className={s.formHeader}>
        <Typography.H2>Create your account</Typography.H2>
      </section>

      <RegistrationFormFields
        handleChange={handleChange}
        onFieldSelected={clearError}
        validationErrors={validationErrors}
        registrationData={registrationData}
      />

      <CreateAccountButton
        onClick={handleUserCreation}
        isLoading={isTrialUserCreating}
      />

      <section className={s.logIn}>
        <Typography.Body size="small" weight="medium">
          Have an account?
          <Link
            to={{
              pathname: `/`,
            }}
            relative="path"
            reloadDocument
            state={{ userNavigated: true }}
            aria-label="Log in link"
          >
            {' '}
            <Typography.Link type="inline-blue">Log in</Typography.Link>
          </Link>
        </Typography.Body>
      </section>
      <section className={s.support}>
        <Typography.Body size="small" weight="medium">
          Having trouble? Contact us at
          <a
            href="mailto:support@boclips.com"
            aria-label="Support email"
            target="_new"
          >
            {' '}
            <Typography.Link type="inline-blue">
              support@boclips.com
            </Typography.Link>
          </a>
        </Typography.Body>
      </section>
    </main>
  );
};

export default RegistrationForm;
