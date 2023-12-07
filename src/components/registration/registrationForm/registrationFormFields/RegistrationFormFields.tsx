import React from 'react';
import { InputText } from '@boclips-ui/input';
import s from 'src/components/registration/style.module.less';
import c from 'classnames';
import Dropdown from '@boclips-ui/dropdown';
import { LIST_OF_COUNTRIES } from 'src/components/registration/dropdownValues';
import RegistrationPageCheckbox from 'src/components/common/input/RegistrationPageCheckbox';
import { RegistrationData } from 'src/components/registration/registrationForm/RegistrationForm';

interface RegistrationFormProps {
  handleChange: (name: string, value: string | string[] | boolean) => void;
  validationErrors: RegistrationData;
  registrationData: RegistrationData;
}

const RegistrationFormFields = ({
  handleChange,
  validationErrors,
  registrationData,
}: RegistrationFormProps) => {
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
          isError={!!validationErrors.confirmPassword}
          errorMessage={validationErrors.confirmPassword}
          errorMessagePlacement="bottom"
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
    </>
  );
};

export default RegistrationFormFields;
