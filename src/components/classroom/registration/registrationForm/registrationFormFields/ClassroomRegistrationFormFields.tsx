import React from 'react';
import { InputText } from '@boclips-ui/input';
import s from 'src/components/classroom/registration/style.module.less';
import c from 'classnames';
import Dropdown from '@boclips-ui/dropdown';
import { LIST_OF_COUNTRIES } from 'src/components/classroom/registration/dropdownValues';
import RegistrationPageCheckbox from 'src/components/common/input/RegistrationPageCheckbox';
import { ClassroomRegistrationData } from 'src/components/classroom/registration/registrationForm/ClassroomRegistrationForm';
import PasswordValidattor from 'react-password-validattor';
import { Typography } from '@boclips-ui/typography';

const passwordConfig = {
  classNames: {
    containerClass: s.passwordContainer,
    gridClass: s.passwordGrid,
    ruleClass: s.passwordRule,
  },
  customText: {
    minLength: {
      successText: '8 characters',
      errorText: '8 characters',
    },
    specialChar: {
      successText: '1 special character',
      errorText: '1 special character',
    },
    number: {
      successText: '1 number',
      errorText: '1 number',
    },
    capital: {
      successText: '1 capital letter',
      errorText: '1 capital letter',
    },
    matches: {
      successText: "Password doesn't match",
      errorText: "Password doesn't match",
    },
  },
};

interface ClassroomRegistrationFormProps {
  handleChange: (name: string, value: string | string[] | boolean) => void;
  validationErrors: ClassroomRegistrationData;
  registrationData: ClassroomRegistrationData;
}

const ClassroomRegistrationFormFields = ({
  handleChange,
  validationErrors,
  registrationData,
}: ClassroomRegistrationFormProps) => {
  const educationalUseTermsLabel = (
    <>
      <Typography.Body size="small" weight="medium">
        I certify that I am accessing this service solely for Educational Use.
      </Typography.Body>
      <Typography.Body size="small" className={s.checkboxCopyColor}>
        {`"Educational Use" is defined as to copy, communicate, edit, and/or
          incorporate into a publication or digital product for a learning
          outcome.`}
      </Typography.Body>
    </>
  );

  const boclipsTermsConditionsLabel = (
    <Typography.Body size="small" weight="medium">
      I understand that by checking this box, I am agreeing to the{' '}
      <a
        rel="noopener noreferrer"
        href="https://www.boclips.com/mlsa-2"
        target="_blank"
      >
        <Typography.Link type="inline-blue">
          Boclips Terms &amp; Conditions
        </Typography.Link>
      </a>
    </Typography.Body>
  );
  return (
    <>
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
        errorMessagePlacement="bottom"
      />

      <div className="flex flex-row items-start">
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
          errorMessagePlacement="bottom"
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
          errorMessagePlacement="bottom"
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
        errorMessagePlacement="bottom"
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
        errorMessagePlacement="bottom"
      />

      <div className="flex flex-col items-start mt-4">
        <div className="flex flex-row w-full">
          <InputText
            id="input-password"
            onChange={(value) => handleChange('password', value)}
            inputType="password"
            placeholder="*********"
            className={c(s.input, 'flex-1 mr-4')}
            labelText="Password"
            height="48px"
            isError={!!validationErrors.password}
            errorMessagePlacement="bottom"
          />

          <InputText
            id="input-confirmPassword"
            onChange={(value) => handleChange('confirmPassword', value)}
            inputType="password"
            placeholder="*********"
            className={c(s.input, 'flex-1')}
            labelText="Confirm password"
            height="48px"
            isError={
              !!validationErrors.confirmPassword || !!validationErrors.password
            }
            errorMessagePlacement="bottom"
          />
        </div>

        {(registrationData.password.length > 0 ||
          !!validationErrors.password) && (
          <PasswordValidattor
            rules={['minLength', 'specialChar', 'capital', 'number', 'matches']}
            minLength={8}
            password={registrationData.password}
            confirmedPassword={
              registrationData.confirmPassword === ''
                ? ' '
                : registrationData.confirmPassword
            }
            config={passwordConfig}
          />
        )}
      </div>
      <div>
        <RegistrationPageCheckbox
          onChange={(event) =>
            handleChange('hasAcceptedEducationalUseTerms', event.target.checked)
          }
          errorMessage={
            validationErrors.hasAcceptedEducationalUseTerms
              ? 'Educational use agreement is required'
              : null
          }
          name="educational-use-agreement"
          id="educational-use-agreement"
          checked={registrationData.hasAcceptedEducationalUseTerms}
          dataQa="input-checkbox-educational-use-agreement"
          label={educationalUseTermsLabel}
        />
        <RegistrationPageCheckbox
          onChange={(event) =>
            handleChange('hasAcceptedTermsAndConditions', event.target.checked)
          }
          errorMessage={
            validationErrors.hasAcceptedTermsAndConditions
              ? 'Boclips Terms and Conditions agreement is required'
              : null
          }
          name="boclips-terms-conditions-agreement"
          id="boclips-terms-conditions-agreement"
          checked={registrationData.hasAcceptedTermsAndConditions}
          dataQa="input-checkbox-boclips-terms-conditions"
          label={boclipsTermsConditionsLabel}
        />
      </div>
    </>
  );
};

export default ClassroomRegistrationFormFields;
