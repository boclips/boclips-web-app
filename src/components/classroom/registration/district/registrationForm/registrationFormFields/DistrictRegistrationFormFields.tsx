import React from 'react';
import { InputText } from '@boclips-ui/input';
import s from 'src/components/classroom/registration/district/style.module.less';
import c from 'classnames';
import RegistrationPageCheckbox from 'src/components/common/input/RegistrationPageCheckbox';
import { DistrictRegistrationData } from 'src/components/classroom/registration/district/registrationForm/DistrictRegistrationForm';
import PasswordValidattor from 'react-password-validattor';
import { Typography } from '@boclips-ui/typography';
import { getUsaStates } from 'src/components/classroom/registration/district/dropdownValues';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';

import {
  Combobox,
  ComboboxItem,
  ComboboxMode,
} from 'src/components/common/headless/combobox';

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

interface DistrictRegistrationFormProps {
  handleChange: (name: string, value: string | string[] | boolean) => void;
  validationErrors: DistrictRegistrationData;
  registrationData: DistrictRegistrationData;
}

const DistrictRegistrationFormFields = ({
  handleChange,
  validationErrors,
  registrationData,
}: DistrictRegistrationFormProps) => {
  const boclipsClient = useBoclipsClient();

  const handleDistrictSearch = async (
    query: string,
  ): Promise<ComboboxItem[]> => {
    const districts = await boclipsClient.districts.searchUsaDistricts(
      registrationData.state,
      query,
    );

    return districts.map((district) => ({
      label: `${district.name}, ${district.city}`,
      value: district.externalId,
    }));
  };

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

  const handleStateUpdate = (selectedState: ComboboxItem) => {
    handleChange('state', selectedState.value);
    handleChange('districtName', '');
    handleChange('ncesDistrictId', undefined);
  };

  const handleDistrictDropdownUpdate = (selectedDistrict: ComboboxItem) => {
    handleChange('districtName', selectedDistrict.label);
    handleChange('ncesDistrictId', selectedDistrict.value);
  };

  return (
    <>
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

      <div className={c(s.input, 'flex flex-row w-full space-x-4')}>
        <Combobox
          items={getUsaStates(boclipsClient)}
          onChange={handleStateUpdate}
          label="State"
          placeholder="Select state"
          isError={!!validationErrors.state}
          errorMessage={validationErrors.state}
          dataQa="input-dropdown-state"
        />
      </div>

      {registrationData.state ? (
        <div className="mb-6">
          <Combobox
            allowCustom={false}
            onChange={handleDistrictDropdownUpdate}
            label="District Name"
            placeholder="Search for district or add manually"
            isError={!!validationErrors.districtName}
            errorMessage={validationErrors.districtName}
            mode={ComboboxMode.FETCH}
            fetchFunction={handleDistrictSearch}
            dataQa="input-dropdown-districtName"
          />
        </div>
      ) : null}

      <div className="flex flex-col items-start">
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

export default DistrictRegistrationFormFields;
