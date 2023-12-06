import React, {
  KeyboardEvent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Typography } from '@boclips-ui/typography';
import Button from '@boclips-ui/button';
import { useAddNewTrialUser } from 'src/hooks/api/userQuery';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import { LoadingOutlined } from '@ant-design/icons';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import * as EmailValidator from 'email-validator';
import PasswordValidator from 'password-validator';
import RegistrationFormFields from 'src/components/registration/registrationForm/registrationFormFields/RegistrationFormFields';
import AcceptedAgreement from 'src/components/registration/registrationForm/AcceptedAgreement';
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

  function isFormDataValid(): boolean {
    const checks = [
      checkIsNotEmpty('firstName', 'First name is required'),
      checkIsNotEmpty('lastName', 'Last name is required'),
      checkIsNotEmpty('email', 'Email is required') &&
        checkHasEmailFormat('email', 'Please enter a valid email address'),
      checkIsNotEmpty('accountName', 'Account name is required'),
      checkIsNotEmpty('password', 'Password is required') &&
        checkPasswordIsStrong(
          'Password must be at least 8 characters long and contain a combination of letters, numbers, and special characters',
        ) &&
        checkPasswordConfirmed('Passwords do not match'),
      checkIsNotEmpty('country', 'Please select a country'),
      checkEducationalUseAgreementValid(),
    ];

    return !checks.some((it) => it === false);
  }

  function checkIsNotEmpty(fieldName: string, errorMessage: string): boolean {
    if (!registrationData[fieldName]) {
      setError(fieldName, errorMessage);
      return false;
    }

    setError(fieldName, '');
    return true;
  }

  function checkHasEmailFormat(
    fieldName: string,
    errorMessage: string,
  ): boolean {
    if (!EmailValidator.validate(registrationData[fieldName])) {
      setError(fieldName, errorMessage);
      return false;
    }

    setError(fieldName, '');
    return true;
  }

  function checkPasswordIsStrong(errorMessage: string): boolean {
    const schema = new PasswordValidator();

    /* eslint-disable */
        schema
            .is().min(8)
            .has().digits()
            .has().letters()
            .has().symbols()
            .has().not().spaces();
        /* eslint-enable  */

    if (!schema.validate(registrationData.password)) {
      setError('password', errorMessage);
      return false;
    }

    setError('password', '');
    return true;
  }

  function checkPasswordConfirmed(errorMessage: string): boolean {
    if (registrationData.password !== registrationData.confirmPassword) {
      setError('confirmPassword', errorMessage);
      return false;
    }

    setError('confirmPassword', '');
    return true;
  }

  function checkEducationalUseAgreementValid(): boolean {
    if (!registrationData.hasAcceptedEducationalUseTerms) {
      setError('hasAcceptedEducationalUseTerms', true);
      return false;
    }
    setError('hasAcceptedEducationalUseTerms', false);
    return true;
  }

  const setError = (fieldName: string, value: boolean | string) => {
    setValidationErrors((prevState) => ({ ...prevState, [fieldName]: value }));
  };

  const handleUserCreation = async () => {
    const token = await tryHandleReCaptchaVerify();

    if (isFormDataValid() && token) {
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
                setError('accountName', 'Account name already exists');
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
  const callbackRef = useRef<() => void>();
  callbackRef.current = handleUserCreation;

  useEffect(() => {
    const handleEvent = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        callbackRef.current?.();
      }
    };

    if (mainRef?.current) {
      // @ts-ignore
      mainRef.current.addEventListener('keydown', handleEvent);
    }

    // @ts-ignore
    return () => mainRef.current.addEventListener('keydown', handleEvent);
  }, [mainRef.current]);

  const getButtonSpinner = (): ReactElement =>
    isTrialUserCreating && (
      <span data-qa="spinner" className={s.spinner}>
        <LoadingOutlined />
      </span>
    );

  return (
    <main ref={mainRef} tabIndex={-1} className={s.formInputsWrapper}>
      <section className={s.formHeader}>
        <Typography.H2>Create your free account</Typography.H2>
      </section>

      <RegistrationFormFields
        handleChange={handleChange}
        validationErrors={validationErrors}
        registrationData={registrationData}
      />

      <section className={s.createAccountButtonWrapper}>
        <Button
          onClick={handleUserCreation}
          text="Create Account"
          disabled={isTrialUserCreating}
          icon={getButtonSpinner()}
          className={s.createAccountButton}
          width="208px"
        />
      </section>

      <AcceptedAgreement />
    </main>
  );
};

export default RegistrationForm;
