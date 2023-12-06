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
import Dropdown from '@boclips-ui/dropdown';
import { LIST_OF_COUNTRIES } from 'src/components/registration/dropdownValues';
import * as EmailValidator from 'email-validator';
import PasswordValidator from 'password-validator';
import RegistrationPageCheckbox from 'src/components/common/input/RegistrationPageCheckbox';
import s from './style.module.less';

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

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      throw new Error('Execute recaptcha not yet available');
    }
    return executeRecaptcha('register');
  }, [executeRecaptcha]);

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

    return !checks.includes(false);
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

  const getButtonSpinner = (): ReactElement =>
    isTrialUserCreating && (
      <span data-qa="spinner" className={s.spinner}>
        <LoadingOutlined />
      </span>
    );

  return (
    <main tabIndex={-1} className={s.formInputsWrapper}>
      <section className={s.formHeader}>
        <Typography.H2>Create your free account</Typography.H2>
      </section>

      <InputText
        id="input-accountName"
        onChange={(value) => handleChange('accountName', value)}
        inputType="text"
        placeholder="Your organization name"
        className={s.input}
        labelText="Organization name"
        height="48px"
        isError={!!validationErrors.accountName}
        errorMessage={validationErrors.accountName}
      />

      <div className="flex flex-row items-end">
        <InputText
          id="input-firstName"
          aria-label="input-firstName"
          onChange={(value) => handleChange('firstName', value)}
          inputType="text"
          placeholder="John"
          className={c(s.input, 'flex-1 mr-4')}
          labelText="First name"
          height="48px"
          isError={!!validationErrors.firstName}
          errorMessage={validationErrors.firstName}
        />
        <InputText
          id="input-lastName"
          onChange={(value) => handleChange('lastName', value)}
          inputType="text"
          placeholder="Smith"
          className={c(s.input, 'flex-1')}
          labelText="Last name"
          height="48px"
          isError={!!validationErrors.lastName}
          errorMessage={validationErrors.lastName}
        />
      </div>

      <InputText
        id="input-email"
        onChange={(value) => handleChange('email', value)}
        inputType="text"
        placeholder="your@email.com"
        className={c(s.input)}
        labelText="Email Address"
        height="48px"
        isError={!!validationErrors.email}
        errorMessage={validationErrors.email}
      />

      <Dropdown
        mode="single"
        placeholder="Select country"
        onUpdate={(value) => handleChange('country', value)}
        options={LIST_OF_COUNTRIES}
        dataQa="input-dropdown-country"
        labelText="Country"
        showSearch
        showLabel
        fitWidth
        isError={!!validationErrors.country}
        errorMessage={validationErrors.country}
      />

      <div className="flex flex-row items-end mt-4">
        <InputText
          id="input-password"
          onChange={(value) => handleChange('password', value)}
          inputType="password"
          placeholder="*********"
          className={c(s.input, 'flex-1 mr-4')}
          labelText="Password"
          height="48px"
          isError={!!validationErrors.password}
          errorMessage={validationErrors.password}
        />

        <InputText
          id="input-confirmPassword"
          onChange={(value) => handleChange('confirmPassword', value)}
          inputType="password"
          placeholder="*********"
          className={c(s.input, 'flex-1')}
          labelText="Confirm password"
          height="48px"
          isError={!!validationErrors.confirmPassword}
          errorMessage={validationErrors.confirmPassword}
        />
      </div>
      <div>
        <RegistrationPageCheckbox
          onChange={(value) =>
            handleChange('hasAcceptedEducationalUseTerms', value.target.checked)
          }
          errorMessage={
            validationErrors.hasAcceptedEducationalUseTerms
              ? 'Educational use agreement is mandatory'
              : null
          }
          name="educational-use-agreement"
          id="educational-use-agreement"
          checked={registrationData.hasAcceptedEducationalUseTerms}
          dataQa="input-checkbox-educational-use-agreement"
        />
      </div>

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

      <Typography.Body size="small" className={c(s.blueText, 'mt-8')}>
        By clicking Create Account, you agree to the Boclips User Agreement,
        Privacy Policy, and Cookie Policy.
      </Typography.Body>
    </main>
  );
};

export default RegistrationForm;
