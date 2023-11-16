import React, { ReactElement, useCallback, useState } from 'react';
import { Typography } from '@boclips-ui/typography';
import Dropdown from '@boclips-ui/dropdown';
import { AUDIENCE } from 'src/components/registration/dropdownValues';
import { InputText } from '@boclips-ui/input';
import Button from '@boclips-ui/button';
import { LoadingOutlined } from '@ant-design/icons';
import { useGetUserQuery, useUpdateUser } from 'src/hooks/api/userQuery';
import {
  UpdateUserRequest,
  UserType,
} from 'boclips-api-client/dist/sub-clients/users/model/UpdateUserRequest';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import s from './style.module.less';

interface MarketingInfo {
  audience: string;
  desiredContent: string;
  jobTitle: string;
}

const MarketingInfoForm = () => {
  const { mutate: updateUser, isLoading: isUserUpdating } = useUpdateUser();
  const { data: user } = useGetUserQuery();

  const [marketingInfo, setMarketingInfo] = useState<MarketingInfo>({
    audience: '',
    desiredContent: '',
    jobTitle: '',
  });

  const [errors, setErrors] = useState({
    isAudienceEmpty: false,
    isDesiredContentEmpty: false,
    isJobTitleEmpty: false,
  });

  const handleChange = useCallback((fieldName: string, value: string) => {
    setMarketingInfo((prevState) => ({
      ...prevState,
      [fieldName]: value.trim(),
    }));
  }, []);

  const getButtonSpinner = (): ReactElement =>
    isUserUpdating && (
      <span data-qa="spinner" className={s.spinner}>
        <LoadingOutlined />
      </span>
    );

  const handleUserUpdate = () => {
    if (!user || !validateForm()) return;

    const request: UpdateUserRequest = {
      type: UserType.b2bUser,
      jobTitle: marketingInfo.jobTitle,
      audience: marketingInfo.audience,
      desiredContent: marketingInfo.desiredContent,
    };

    updateUser(
      { user, request },
      {
        onSuccess: (isSuccess: boolean) => {
          if (isSuccess) {
            displayNotification(
              'success',
              `User ${user.email} successfully updated`,
            );
          } else {
            displayNotification('error', 'User update failed');
          }
        },
        onError: (error: Error) => {
          displayNotification('error', 'User update failed', error?.message);
        },
      },
    );
  };

  const validateForm = (): boolean => {
    const isJobTitleEmpty = !marketingInfo.jobTitle.trim();
    const isAudienceEmpty = !marketingInfo.audience.trim();
    const isDesiredContentEmpty = !marketingInfo.desiredContent.trim();

    setErrors({ isJobTitleEmpty, isAudienceEmpty, isDesiredContentEmpty });

    return !isJobTitleEmpty && !isAudienceEmpty && !isDesiredContentEmpty;
  };

  return (
    user && (
      <>
        <main tabIndex={-1} className={s.marketingInfoWrapper}>
          <Typography.Body size="small">
            To complete the setup of your account, we require a few additional
            details (all fields marked * are mandatory).
          </Typography.Body>
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
          <div className={s.line} />
          <Typography.Body size="small">
            By clicking Create Account, you agree to the{' '}
            <Typography.Link type="inline-blue">
              <a href="https://www.boclips.com/terms-and-conditions">
                Boclips Terms & Conditions
              </a>
            </Typography.Link>{' '}
            and{' '}
            <Typography.Link type="inline-blue">
              <a href="https://www.boclips.com/privacy-policy">
                Privacy Policy
              </a>
            </Typography.Link>
          </Typography.Body>
        </main>
        <section className={s.updateMarketingInfoButtonWrapper}>
          <Button
            onClick={handleUserUpdate}
            text="Create Account"
            className={s.updateMarketingInfoButton}
            disabled={isUserUpdating}
            icon={getButtonSpinner()}
          />
        </section>
      </>
    )
  );
};

export default MarketingInfoForm;
