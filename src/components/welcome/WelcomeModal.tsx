import React, { useState } from 'react';
import { Bodal } from 'src/components/common/bodal/Bodal';
import MarketingInfoForm from 'src/components/welcome/MarketingInfoForm';
import InvitedUserInfo from 'src/components/welcome/InvitedUserInfo';
import { useGetUserQuery, useUpdateUser } from 'src/hooks/api/userQuery';
import {
  UpdateUserRequest,
  UserType,
} from 'boclips-api-client/dist/sub-clients/users/model/UpdateUserRequest';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import AcceptedAgreement from 'src/components/registration/registrationForm/AcceptedAgreement';
import s from './style.module.less';

export interface MarketingInfo {
  audience: string;
  desiredContent: string;
  jobTitle: string;
  discoveryMethods: string[];
}

interface Props {
  showPopup: (arg: boolean) => void;
}

const WelcomeModal = ({ showPopup }: Props) => {
  const { mutate: updateUser, isLoading: isUserUpdating } = useUpdateUser();
  const { data: user } = useGetUserQuery();

  const [marketingInfo, setMarketingInfo] = useState<MarketingInfo>({
    audience: '',
    desiredContent: '',
    jobTitle: '',
    discoveryMethods: [],
  });

  const [errors, setErrors] = useState({
    isAudienceEmpty: false,
    isDesiredContentEmpty: false,
    isJobTitleEmpty: false,
    isDiscoveryMethodEmpty: false,
    isOrganizationTypeEmpty: false,
  });

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
            showPopup(false);
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

    setErrors({
      isJobTitleEmpty,
      isAudienceEmpty,
      isDesiredContentEmpty,
      isDiscoveryMethodEmpty: false,
      isOrganizationTypeEmpty: false,
    });

    return !isJobTitleEmpty && !isAudienceEmpty && !isDesiredContentEmpty;
  };

  return (
    <Bodal
      closeOnClickOutside={false}
      displayCancelButton={false}
      showCloseIcon={false}
      onConfirm={handleUserUpdate}
      isLoading={isUserUpdating}
      footerClass={s.footer}
      title="Tell us a bit more about you"
      footerText={<FooterText />}
      confirmButtonText={"Let's Go!"}
    >
      <InvitedUserInfo />
      <MarketingInfoForm
        errors={errors}
        setMarketingInfo={setMarketingInfo}
        isAdmin // todo: recognize admin
      />
    </Bodal>
  );
};

const FooterText = () => (
  <div className="w-full text-center mt-4">
    <AcceptedAgreement buttonText="Let's Go!" />
  </div>
);
export default WelcomeModal;
