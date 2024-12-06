import React, { useCallback } from 'react';
import { Dropdown, Typography, Input } from 'boclips-ui';
import {
  AUDIENCE,
  DISCOVERY_METHOD,
  LIBRARY_JOB_TITLE,
  CLASSROOM_JOB_TITLE,
  ORGANIZATION_TYPE,
} from '@components/registration/dropdownValues';
import s from './style.module.less';

interface Props {
  errors: { [key: string]: boolean };
  setMarketingInfo: (prevState) => void;
  isAdmin: boolean;
  isClassroomUser?: boolean;
}

const MarketingInfoForm = ({
  errors,
  setMarketingInfo,
  isAdmin,
  isClassroomUser = false,
}: Props) => {
  const handleChange = useCallback(
    (fieldName: string, value: string | string[]) => {
      setMarketingInfo((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    },
    [],
  );

  const jobTitleOptions = isClassroomUser
    ? CLASSROOM_JOB_TITLE
    : LIBRARY_JOB_TITLE;

  return (
    <main tabIndex={-1} className={s.marketingInfoWrapper}>
      {!isAdmin && (
        <Typography.Body className="text-gray-800">
          Complete your account setup by filling in the details below.
        </Typography.Body>
      )}
      <Dropdown
        mode="single"
        labelText="Job Title"
        onUpdate={(value: string) => handleChange('jobTitle', value)}
        options={jobTitleOptions}
        dataQa="input-dropdown-job-title"
        placeholder="Select your job title"
        showLabel
        fitWidth
        isError={errors.isJobTitleEmpty}
        errorMessage="Job title is required"
      />
      {isAdmin && !isClassroomUser && (
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
        mode="multiple"
        labelText="Audience"
        onUpdate={(values: string[]) => handleChange('audiences', values)}
        options={AUDIENCE}
        dataQa="input-dropdown-audience"
        placeholder="Select your main audience"
        showLabel
        fitWidth
        isError={errors.isAudiencesEmpty}
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
      <Input
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
