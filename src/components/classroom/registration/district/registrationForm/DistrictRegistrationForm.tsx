import React, { useRef, useState } from 'react';
import { Typography } from '@boclips-ui/typography';
import { useAddNewDistrictUser } from 'src/hooks/api/userQuery';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { User } from 'boclips-api-client/dist/sub-clients/users/model/User';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import CreateAccountButton from 'src/components/classroom/registration/createAccountButton/CreateAccountButton';
import FormValidator from 'src/components/classroom/registration/district/registrationForm/validation/validation';
import { Link } from 'react-router-dom';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import DistrictRegistrationFormFields from './registrationFormFields/DistrictRegistrationFormFields';
import s from '../style.module.less';

export interface DistrictRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  state: string;
  districtName: string;
  ncesDistrictId: string;
  hasAcceptedEducationalUseTerms: boolean;
  hasAcceptedTermsAndConditions: boolean;
}

const emptyRegistrationData = (): DistrictRegistrationData => {
  return {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    state: '',
    districtName: '',
    ncesDistrictId: '',
    hasAcceptedEducationalUseTerms: false,
    hasAcceptedTermsAndConditions: false,
  };
};

interface RegistrationFormProps {
  onRegistrationFinished: (userEmail: string) => void;
}

const DistrictRegistrationForm = ({
  onRegistrationFinished,
}: RegistrationFormProps) => {
  const { mutate: createDistrictUser, isLoading: isDistrictUserCreating } =
    useAddNewDistrictUser();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptchaVerify = async () => {
    if (!executeRecaptcha) {
      throw new Error('Execute recaptcha not yet available');
    }
    return executeRecaptcha('register');
  };

  const [registrationData, setRegistrationData] =
    useState<DistrictRegistrationData>(emptyRegistrationData());

  const [validationErrors, setValidationErrors] =
    useState<DistrictRegistrationData>(emptyRegistrationData());

  const handleChange = (
    fieldName: string,
    value?: string | boolean | string[],
  ) => {
    setRegistrationData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
    clearError(fieldName);
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
      createDistrictUser(
        {
          email: registrationData.email,
          firstName: registrationData.firstName,
          lastName: registrationData.lastName,
          password: registrationData.password,
          recaptchaToken: token,
          type: UserType.districtUser,
          districtName: registrationData.districtName,
          country: 'USA',
          state: registrationData.state,
          hasAcceptedEducationalUseTerms:
            registrationData.hasAcceptedEducationalUseTerms,
          hasAcceptedTermsAndConditions:
            registrationData.hasAcceptedTermsAndConditions,
          ncesDistrictId: registrationData.ncesDistrictId,
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
                  'districtName',
                  'Cannot use this district name. Try another or contact us.',
                );
                break;
              default:
                displayNotification(
                  'error',
                  'User creation failed',
                  error?.message,
                );
            }

            AnalyticsFactory.pendo().trackClassroomDistrictAccountCreationFailure(
              registrationData.email,
              registrationData.districtName,
              error?.message,
            );
          },
        },
      );
    }
  };

  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <main ref={mainRef} tabIndex={-1} className={s.formInputsWrapper}>
      <section className={s.formHeader}>
        <Typography.H2>Create a trial account</Typography.H2>
        <Typography.Body>
          For a limited time, Boclips District is available to educators through
          the end of the 2024–2025 school year with a free trial.
        </Typography.Body>
        <Typography.Body>
          Interested in a school/district pilot?
        </Typography.Body>
        <Typography.Link type="inline-blue">
          <a href="https://www.boclips.com/contact">Schedule a consultation</a>
        </Typography.Link>
      </section>

      <DistrictRegistrationFormFields
        handleChange={handleChange}
        validationErrors={validationErrors}
        registrationData={registrationData}
      />

      <CreateAccountButton
        onClick={handleUserCreation}
        isLoading={isDistrictUserCreating}
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

export default DistrictRegistrationForm;
