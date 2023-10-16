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
import s from './style.module.less';

interface RegistrationData {
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
}

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

  const [registrationData, setRegistrationData] = useState<RegistrationData>({
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
  });

  const handleChange = (fieldName, value) => {
    if (!value) return;
    setRegistrationData((prevState) => ({ ...prevState, [fieldName]: value }));
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

  const handleUserCreation = async () => {
    const token = await tryHandleReCaptchaVerify();

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
            className={c(s.input, 'flex-1 mr-4')}
            labelText="First name"
            height="48px"
          />
          <InputText
            id="input-lastName"
            onChange={(value) => handleChange('lastName', value)}
            inputType="text"
            placeholder="Smith"
            className={c(s.input, 'flex-1')}
            labelText="Last name"
            height="48px"
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
        />
        <div className="flex flex-row">
          <InputText
            id="input-password"
            onChange={(value) => handleChange('password', value)}
            inputType="password"
            placeholder="*********"
            className={c(s.input, 'flex-1 mr-4')}
            labelText="Password"
            height="48px"
          />
          <InputText
            id="input-confirmPassword"
            onChange={(value) => handleChange('confirmPassword', value)}
            inputType="password"
            placeholder="*********"
            className={c(s.input, 'flex-1')}
            labelText="Confirm password"
            height="48px"
          />
        </div>

        <InputText
          id="input-accountName"
          onChange={(value) => handleChange('accountName', value)}
          inputType="text"
          placeholder="Your account name"
          defaultValue={registrationData.firstName}
          className={s.input}
          labelText="Account name"
          height="48px"
        />

        <div className="flex flex-row mb-2">
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
            />
          </div>
        </div>

        <div className="flex flex-row">
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
