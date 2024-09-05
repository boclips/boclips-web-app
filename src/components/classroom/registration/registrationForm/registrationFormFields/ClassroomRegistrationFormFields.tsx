import React from 'react';
import { InputText } from '@boclips-ui/input';
import s from 'src/components/classroom/registration/style.module.less';
import c from 'classnames';
import Dropdown from '@boclips-ui/dropdown';
import RegistrationPageCheckbox from 'src/components/common/input/RegistrationPageCheckbox';
import { ClassroomRegistrationData } from 'src/components/classroom/registration/registrationForm/ClassroomRegistrationForm';
import PasswordValidattor from 'react-password-validattor';
import { Typography } from '@boclips-ui/typography';
import {
  countries,
  states,
} from 'src/components/classroom/registration/dropdownValues';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';

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
  onFieldSelected: (name: string) => void;
  validationErrors: ClassroomRegistrationData;
  registrationData: ClassroomRegistrationData;
}

const ClassroomRegistrationFormFields = ({
  handleChange,
  onFieldSelected,
  validationErrors,
  registrationData,
}: ClassroomRegistrationFormProps) => {
  const boclipsClient = useBoclipsClient();
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
        href="https://www.boclips.com/mlsa-classroom"
        target="_blank"
      >
        <Typography.Link type="inline-blue">
          Boclips Terms &amp; Conditions
        </Typography.Link>
      </a>
    </Typography.Body>
  );

  const handleCountryUpdate = (value) => {
    handleChange('state', '');
    handleChange('country', value);
  };

  return (
    <>
      <div className="flex flex-row items-start">
        <InputText
          id="input-firstName"
          aria-label="input-firstName"
          onFocus={() => onFieldSelected('firstName')}
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
          onFocus={() => onFieldSelected('lastName')}
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
        onFocus={() => onFieldSelected('email')}
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

      <div className={c(s.input, 'flex flex-row w-full')}>
        <Dropdown
          mode="single"
          placeholder="Select country"
          onFocused={() => onFieldSelected('country')}
          onUpdate={handleCountryUpdate}
          options={countries(boclipsClient)}
          dataQa="input-dropdown-country"
          labelText="Country"
          showSearch
          showLabel
          fitWidth
          isError={!!validationErrors.country}
          errorMessage={validationErrors.country}
          errorMessagePlacement="bottom"
        />

        {states(registrationData.country, boclipsClient) && (
          <div className="flex flex-row w-full ml-4">
            <Dropdown
              mode="single"
              placeholder="Select state"
              onFocused={() => onFieldSelected('state')}
              onUpdate={(value) => handleChange('state', value)}
              options={states(registrationData.country, boclipsClient)}
              dataQa="input-dropdown-state"
              labelText="State"
              showSearch
              showLabel
              fitWidth
              isError={!!validationErrors.state}
              errorMessage={validationErrors.state}
              errorMessagePlacement="bottom"
            />
          </div>
        )}
      </div>

      <InputText
        id="input-schoolName"
        onFocus={() => onFieldSelected('schoolName')}
        onChange={(value) => handleChange('schoolName', value)}
        inputType="text"
        placeholder="Your school name"
        className={s.input}
        labelText="School name"
        height="48px"
        isError={!!validationErrors.schoolName}
        errorMessage={validationErrors.schoolName}
        errorMessagePlacement="bottom"
      />

      <div className="flex flex-col items-start">
        <div className="flex flex-row w-full">
          <InputText
            id="input-password"
            onFocus={() => {
              onFieldSelected('password');
              onFieldSelected('confirmPassword');
            }}
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
            onFocus={() => {
              onFieldSelected('password');
              onFieldSelected('confirmPassword');
            }}
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
            rules={['minLength', 'specialChar', 'capital', 'matches', 'number']}
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
          onFocus={() => onFieldSelected('hasAcceptedEducationalUseTerms')}
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
          onFocus={() => onFieldSelected('hasAcceptedTermsAndConditions')}
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
