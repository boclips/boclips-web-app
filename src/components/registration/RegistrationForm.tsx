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
import {
  AUDIENCE,
  JOB_TITLE,
  LIST_OF_COUNTRIES,
  TYPE_OF_ORG,
} from 'src/components/registration/dropdownValues';
import { EducationalUseCheckbox } from 'src/components/registration/EducationalUseCheckbox';
import * as EmailValidator from 'email-validator';
import PasswordValidator from 'password-validator';
import s from './style.module.less';

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountName: string;
  country: string;
  typeOfOrg: string;
  audience: string;
  discoveryMethod: string;
  desiredContent: string;
  jobTitle: string;
  educationalUse: boolean;
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
    typeOfOrg: '',
    audience: '',
    discoveryMethod: '',
    desiredContent: '',
    jobTitle: '',
    educationalUse: false,
  };
};

const RegistrationForm = () => {
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

  const handleChange = (fieldName, value) => {
    setRegistrationData((prevState) => ({
      ...prevState,
      [fieldName]: value instanceof String ? value.trim() : value,
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
      checkIsNotEmpty('jobTitle', 'Please select a job title'),
      checkIsNotEmpty('country', 'Please select a country'),
      checkIsNotEmpty('typeOfOrg', 'Please select a type of organisation'),
      checkIsNotEmpty('audience', 'Please select an audience'),
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
    if (!registrationData.educationalUse) {
      setError('educationalUse', true);
      return false;
    }
    setError('educationalUse', false);
    return true;
  }

  const setError = (fieldName, value) => {
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
          jobTitle: registrationData.jobTitle,
          marketingInformation: {
            country: registrationData.country,
            organisationType: registrationData.typeOfOrg,
            audience: registrationData.audience,
            discoveryMethod: registrationData.discoveryMethod,
            desiredContent: registrationData.desiredContent,
          },
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
    }
  };

  const getButtonSpinner = (): ReactElement =>
    isTrialUserCreating && (
      <span data-qa="spinner" className={s.spinner}>
        <LoadingOutlined />
      </span>
    );

  return (
    <>
      <section className={s.formHeader}>
        <Typography.H1>CourseSpark</Typography.H1>
        <Typography.Body weight="medium" className={s.blueText}>
          Create new account
        </Typography.Body>
        <Typography.Body size="small" className={s.blueText}>
          7 day trial
        </Typography.Body>
      </section>
      <main tabIndex={-1} className={s.formInputsWrapper}>
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
          placeholder="smith@gmail.com"
          className={c(s.input)}
          labelText="Professional email"
          height="48px"
          isError={!!validationErrors.email}
          errorMessage={validationErrors.email}
        />
        <div className="flex flex-row items-end">
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

        <InputText
          id="input-accountName"
          onChange={(value) => handleChange('accountName', value)}
          inputType="text"
          placeholder="Your account name"
          className={s.input}
          labelText="Account name"
          height="48px"
          isError={!!validationErrors.accountName}
          errorMessage={validationErrors.accountName}
        />

        <div className="flex flex-row items-end	mb-2">
          <div className="flex-1 mr-4">
            <Dropdown
              mode="single"
              placeholder="Your job title"
              onUpdate={(value) => handleChange('jobTitle', value)}
              options={JOB_TITLE}
              dataQa="input-dropdown-job-title"
              labelText="Job title"
              showLabel
              fitWidth
              isError={!!validationErrors.jobTitle}
              errorMessage={validationErrors.jobTitle}
            />
          </div>
          <div className="flex-1">
            <Dropdown
              mode="single"
              placeholder="Select country"
              onUpdate={(value) => handleChange('country', value)}
              options={LIST_OF_COUNTRIES}
              dataQa="input-dropdown-country"
              labelText="Country"
              showLabel
              fitWidth
              isError={!!validationErrors.country}
              errorMessage={validationErrors.country}
            />
          </div>
        </div>

        <div className="flex flex-row items-end">
          <div className="flex flex-1 items-end mb-2 mr-4">
            <Dropdown
              mode="single"
              placeholder="Type of organization"
              onUpdate={(value) => handleChange('typeOfOrg', value)}
              options={TYPE_OF_ORG}
              dataQa="input-dropdown-type-of-org"
              labelText="Type of organization"
              showLabel
              fitWidth
              isError={!!validationErrors.typeOfOrg}
              errorMessage={validationErrors.typeOfOrg}
            />
          </div>
          <div className="flex flex-1 items-end mb-2">
            <Dropdown
              mode="single"
              placeholder="Audience"
              onUpdate={(value) => handleChange('audience', value)}
              options={AUDIENCE}
              dataQa="input-dropdown-audience"
              labelText="Select audience"
              showLabel
              fitWidth
              isError={!!validationErrors.audience}
              errorMessage={validationErrors.audience}
            />
          </div>
        </div>

        <InputText
          id="input-discovery-method"
          onChange={(value) => handleChange('discoveryMethod', value)}
          inputType="textarea"
          placeholder="Enter text here"
          className={`${s.input} flex-1`}
          labelText="How did you hear about Boclips?"
        />

        <InputText
          id="input-desired-content"
          onChange={(value) => handleChange('desiredContent', value)}
          inputType="textarea"
          placeholder="Enter text here"
          className={`${s.input} flex-1`}
          labelText="What content are you looking for?"
        />
        <div>
          <EducationalUseCheckbox
            isError={validationErrors.educationalUse}
            checked={registrationData.educationalUse}
            setChecked={(value) => handleChange('educationalUse', value)}
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
