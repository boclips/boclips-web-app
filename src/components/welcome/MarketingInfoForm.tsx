import React, { useCallback } from 'react';
import Dropdown from '@boclips-ui/dropdown';
import {
  AUDIENCE,
  DISCOVERY_METHOD,
  ORGANIZATION_TYPE,
} from 'src/components/registration/dropdownValues';
import { InputText } from '@boclips-ui/input';
import s from './style.module.less';

interface Props {
  errors: { [key: string]: boolean };
  setMarketingInfo: (prevState) => void;
  isAdmin: boolean;
}

const MarketingInfoForm = ({ errors, setMarketingInfo, isAdmin }: Props) => {
  const handleChange = useCallback(
    (fieldName: string, value: string | string[]) => {
      setMarketingInfo((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    },
    [],
  );

  return (
    <main tabIndex={-1} className={s.marketingInfoWrapper}>
      <InputText
        id="input-jobTitle"
        aria-label="input-jobTitle"
        onChange={(value) => handleChange('jobTitle', value)}
        inputType="text"
        placeholder="Select your job title"
        className={s.input}
        labelText="Job Title"
        height="48px"
        isError={errors.isJobTitleEmpty}
        errorMessage="Job title is required"
      />
      {isAdmin && (
        <Dropdown
          mode="multiple"
          labelText="Organization type"
          onUpdate={(values: string[]) => {
            handleChange('organizationTypes', values);
          }}
          options={ORGANIZATION_TYPE}
          dataQa="input-dropdown-organization-type"
          placeholder="Select your organization type"
          showLabel
          fitWidth
          isError={errors.isOrganizationTypesEmpty}
          errorMessage="Organization type is required"
        />
      )}
      <Dropdown
        mode="single"
        labelText="Audience"
        onUpdate={(value: string) => handleChange('audience', value)}
        options={AUDIENCE}
        dataQa="input-dropdown-audience"
        placeholder="Select your main audience (you can select more than one)"
        showLabel
        fitWidth
        isError={errors.isAudienceEmpty}
        errorMessage="Audience is required"
      />
      {isAdmin && (
        <Dropdown
          mode="multiple"
          labelText="I heard about Boclips"
          onUpdate={(values: string[]) =>
            handleChange('discoveryMethods', values)
          }
          options={DISCOVERY_METHOD}
          dataQa="input-dropdown-discovery-method"
          placeholder="How did you hear about us"
          showLabel
          fitWidth
          isError={errors.isDiscoveryMethodsEmpty}
          errorMessage="I heard about Boclips is required"
        />
      )}
      <InputText
        id="input-desiredContent"
        aria-label="input-desiredContent"
        onChange={(value) => handleChange('desiredContent', value)}
        inputType="text"
        placeholder="I am looking for content in these topics..."
        className={s.input}
        labelText="Content Topics"
        height="48px"
        isError={errors.isDesiredContentEmpty}
        errorMessage="Content topics is required"
      />
    </main>
  );
};

export default MarketingInfoForm;
