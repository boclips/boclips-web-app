import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Typography } from '@boclips-ui/typography';
import { useAddNewClassroomUser } from 'src/hooks/api/userQuery';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import ClassroomRegistrationFormFields from 'src/components/classroom/registration/registrationForm/registrationFormFields/ClassroomRegistrationFormFields';
import CreateAccountButton from 'src/components/classroom/registration/registrationForm/createAccountButton/CreateAccountButton';
import FormValidator from 'src/components/classroom/registration/registrationForm/validation/validation';
import { Link } from 'react-router-dom';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import s from '../style.module.less';

export interface ClassroomRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  schoolName: string;
  country: string;
  hasAcceptedEducationalUseTerms: boolean;
  hasAcceptedTermsAndConditions: boolean;
}

const emptyRegistrationData = (): ClassroomRegistrationData => {
  return {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    country: '',
    hasAcceptedEducationalUseTerms: false,
    hasAcceptedTermsAndConditions: false,
  };
};

interface RegistrationFormProps {
  onRegistrationFinished: (userEmail: string) => void;
}

const ClassroomRegistrationForm = ({
  onRegistrationFinished,
}: RegistrationFormProps) => {
  const { mutate: createClassroomUser, isLoading: isClassroomUserCreating } =
    useAddNewClassroomUser();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptchaVerify = async () => {
    if (!executeRecaptcha) {
      throw new Error('Execute recaptcha not yet available');
    }
    return executeRecaptcha('register');
  };

  const [registrationData, setRegistrationData] =
    useState<ClassroomRegistrationData>(emptyRegistrationData());

  const [validationErrors, setValidationErrors] =
    useState<ClassroomRegistrationData>(emptyRegistrationData());

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
      createClassroomUser(
        {
          email: registrationData.email,
          firstName: registrationData.firstName,
          lastName: registrationData.lastName,
          password: registrationData.password,
          recaptchaToken: token,
          type: UserType.classroomUser,
          schoolName: registrationData.schoolName,
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
                  'schoolName',
                  'Cannot use this school name. Try another or contact us.',
                );
                break;
              default:
                displayNotification(
                  'error',
                  'User creation failed',
                  error?.message,
                );
            }

            AnalyticsFactory.pendo().trackClassroomAccountCreationFailure(
              registrationData.email,
              registrationData.schoolName,
              error?.message,
            );
          },
        },
      );
    }
  };

  const mainRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef<() => void>();
  callbackRef.current = handleUserCreation;

  useEffect(() => {
    const handleEvent = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        callbackRef.current?.();
      }
    };

    if (mainRef?.current) {
      // @ts-ignore | not sure what going on here with the type
      mainRef.current.addEventListener('keydown', handleEvent);
    }

    // @ts-ignore
    return () => mainRef.current?.addEventListener('keydown', handleEvent);
  }, [mainRef]);

  return (
    <main ref={mainRef} tabIndex={-1} className={s.formInputsWrapper}>
      <section className={s.formHeader}>
        <Typography.H2>Create your account</Typography.H2>
      </section>

      <ClassroomRegistrationFormFields
        handleChange={handleChange}
        onFieldSelected={clearError}
        validationErrors={validationErrors}
        registrationData={registrationData}
      />

      <CreateAccountButton
        onClick={handleUserCreation}
        isLoading={isClassroomUserCreating}
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

export default ClassroomRegistrationForm;
