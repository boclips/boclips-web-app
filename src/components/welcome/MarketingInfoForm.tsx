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
        placeholder="example: Designer"
        className={s.input}
        labelText="Job Title*"
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
          placeholder="Example"
          showLabel
          fitWidth
          isError={errors.isOrganizationTypesEmpty}
          errorMessage="Organization type is required"
        />
      )}
      <Dropdown
        mode="single"
        labelText="Your audience type*"
        onUpdate={(value: string) => handleChange('audience', value)}
        options={AUDIENCE}
        dataQa="input-dropdown-audience"
        placeholder="example: K12"
        showLabel
        fitWidth
        isError={errors.isAudienceEmpty}
        errorMessage="Audience type is required"
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
          placeholder="Via: Online"
          showLabel
          fitWidth
          isError={errors.isDiscoveryMethodsEmpty}
          errorMessage="Discovery method is required"
        />
      )}
      <InputText
        id="input-desiredContent"
        aria-label="input-desiredContent"
        onChange={(value) => handleChange('desiredContent', value)}
        inputType="text"
        placeholder="Design"
        className={s.input}
        labelText="What Content are you interested in*"
        height="48px"
        isError={errors.isDesiredContentEmpty}
        errorMessage="Desired content is required"
      />
    </main>
  );
};

export default MarketingInfoForm;
