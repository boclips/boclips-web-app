import React from 'react';
import { InputText } from '@boclips-ui/input';
import s from 'src/components/classroom/registration/district/style.module.less';
import c from 'classnames';
import RegistrationPageCheckbox from 'src/components/common/input/RegistrationPageCheckbox';
import {
  DistrictRegistrationData,
  ValidationErrors,
} from 'src/components/classroom/registration/district/registrationForm/DistrictRegistrationForm';
import PasswordValidattor from 'react-password-validattor';
import { Typography } from '@boclips-ui/typography';
import { getUsaStates } from 'src/components/classroom/registration/district/dropdownValues';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import {
  Combobox,
  ComboboxItem,
  ComboboxMode,
} from 'src/components/common/headless/combobox';
import {
  INSTRUCTIONAL_VIDEO_SOURCE,
  REASON,
  SUBJECTS,
  USAGE_FREQUENCY,
  VIDEO_RESOURCE_BARRIERS,
} from 'src/components/classroom/registration/district/registrationForm/registrationFormFields/dropdownValues';
import {
  MultiCombobox,
  MultiComboboxItem,
} from 'src/components/common/headless/MultiCombobox';

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
  validationErrors: ValidationErrors;
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
    handleChange('state', selectedState?.value);
    handleChange('districtName', '');
    handleChange('ncesDistrictId', undefined);
  };

  const handleDistrictDropdownUpdate = (selectedDistrict: ComboboxItem) => {
    handleChange('districtName', selectedDistrict?.label);
    handleChange('ncesDistrictId', selectedDistrict?.value);
  };

  const handleComboboxItemUpdate = (
    propertyKey: string,
    selectedItem: ComboboxItem,
  ) => {
    handleChange(propertyKey, selectedItem?.value ?? selectedItem?.label);
  };

  const handleMultiComboboxItemUpdate = (
    propertyKey: string,
    selectedItem: ComboboxItem[],
  ) => {
    handleChange(
      propertyKey,
      selectedItem?.map((item) => item.value),
    );
  };

  return (
    <>
      <div className={c(s.input, 'flex flex-row w-full space-x-4')}>
        <Combobox
          items={getUsaStates(boclipsClient)}
          onChange={handleStateUpdate}
          label="State"
          placeholder="Select state"
          isError={!!validationErrors.state?.isError}
          errorMessage={validationErrors.state?.errorMessage}
          dataQa="input-dropdown-state"
        />
      </div>

      {registrationData.state ? (
        <div className="mb-6">
          <Combobox
            allowCustom={false}
            onChange={handleDistrictDropdownUpdate}
            label="District Name"
            placeholder="Search for district"
            isError={!!validationErrors.districtName?.isError}
            errorMessage={validationErrors.districtName?.errorMessage}
            mode={ComboboxMode.FETCH}
            fetchFunction={handleDistrictSearch}
            dataQa="input-dropdown-districtName"
          />
        </div>
      ) : null}

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
          isError={!!validationErrors.firstName?.isError}
          errorMessage={validationErrors.firstName?.errorMessage}
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
          isError={!!validationErrors.lastName?.isError}
          errorMessage={validationErrors.lastName?.errorMessage}
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
        isError={!!validationErrors.email?.isError}
        errorMessage={validationErrors.email?.errorMessage}
        errorMessagePlacement="bottom"
      />

      <div className="flex flex-col items-start">
        <div className="flex flex-row w-full">
          <InputText
            id="input-password"
            onChange={(value) => {
              handleChange('password', value);
            }}
            inputType="password"
            placeholder="*********"
            className={c(s.input, 'flex-1 mr-4')}
            labelText="Password"
            height="48px"
            isError={!!validationErrors.password?.isError}
            errorMessage={validationErrors.password?.errorMessage}
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
              !!validationErrors.confirmPassword?.isError ||
              !!validationErrors.password?.isError
            }
            errorMessage={
              validationErrors.confirmPassword?.errorMessage ||
              validationErrors.password?.errorMessage
            }
            errorMessagePlacement="bottom"
          />
        </div>

        {(registrationData.password.length > 0 ||
          !!validationErrors.password?.isError) && (
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

      <div className="flex flex-col gap-4 items-start mb-6">
        <Combobox
          items={USAGE_FREQUENCY}
          onChange={(value: ComboboxItem) =>
            handleComboboxItemUpdate('usageFrequency', value)
          }
          label="How frequently do you currently use video in your classes?"
          placeholder="Select your usage frequency"
          mode={ComboboxMode.FILTER}
          isError={!!validationErrors.usageFrequency?.isError}
          errorMessage={validationErrors.usageFrequency?.errorMessage}
          dataQa="input-dropdown-usageFrequency"
        />
        <Combobox
          items={INSTRUCTIONAL_VIDEO_SOURCE}
          onChange={(value: ComboboxItem) =>
            handleComboboxItemUpdate('instructionalVideoSource', value)
          }
          label="Where do you currently get most of your instructional videos from?"
          placeholder="Select your instructional video source"
          mode={ComboboxMode.FILTER}
          isError={!!validationErrors.instructionalVideoSource?.isError}
          errorMessage={validationErrors.instructionalVideoSource?.errorMessage}
          dataQa="input-dropdown-instructionalVideoSource"
        />
        <MultiCombobox
          items={VIDEO_RESOURCE_BARRIERS}
          onChange={(values: MultiComboboxItem[]) =>
            handleMultiComboboxItemUpdate('videoResourceBarriers', values)
          }
          label="What barriers do you face with current video resources?"
          placeholder="Select one or more barriers"
          isError={!!validationErrors.videoResourceBarriers?.isError}
          errorMessage={validationErrors.videoResourceBarriers?.errorMessage}
          dataQa="input-dropdown-videoResourceBarriers"
        />
        <MultiCombobox
          items={SUBJECTS}
          onChange={(values: MultiComboboxItem[]) =>
            handleMultiComboboxItemUpdate('subjects', values)
          }
          label="What subject do you teach?"
          placeholder="Select one or more subjects"
          isError={!!validationErrors.subjects?.isError}
          errorMessage={validationErrors.subjects?.errorMessage}
          dataQa="input-dropdown-subjects"
        />
        <Combobox
          allowCustom
          items={REASON}
          onChange={(value: ComboboxItem) =>
            handleComboboxItemUpdate('reason', value)
          }
          label="I want to try Boclips because"
          placeholder="Select a reason (or enter your own)"
          mode={ComboboxMode.FILTER}
          isError={!!validationErrors.reason?.isError}
          errorMessage={validationErrors.reason?.errorMessage}
          dataQa="input-dropdown-reason"
        />
      </div>

      <div>
        <RegistrationPageCheckbox
          onChange={(event) =>
            handleChange('hasAcceptedEducationalUseTerms', event.target.checked)
          }
          errorMessage={
            validationErrors.hasAcceptedEducationalUseTerms?.isError
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
            validationErrors.hasAcceptedTermsAndConditions?.isError
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
