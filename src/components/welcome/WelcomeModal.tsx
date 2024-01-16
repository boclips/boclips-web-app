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
  organizationTypes: string[];
}

interface Props {
  showPopup: (arg: boolean) => void;
  isAdmin: boolean;
}

const WelcomeModal = ({ showPopup, isAdmin }: Props) => {
  const { mutate: updateUser, isLoading: isUserUpdating } = useUpdateUser();
  const { data: user } = useGetUserQuery();

  const [marketingInfo, setMarketingInfo] = useState<MarketingInfo>({
    audience: '',
    desiredContent: '',
    jobTitle: '',
    discoveryMethods: [],
    organizationTypes: [],
  });

  const [errors, setErrors] = useState({
    isAudienceEmpty: false,
    isDesiredContentEmpty: false,
    isJobTitleEmpty: false,
    isDiscoveryMethodsEmpty: false,
    isOrganizationTypesEmpty: false,
  });

  const handleUserUpdate = () => {
    if (!user || !validateForm()) return;

    const request: UpdateUserRequest = {
      type: UserType.b2bUser,
      jobTitle: marketingInfo.jobTitle,
      audience: marketingInfo.audience,
      desiredContent: marketingInfo.desiredContent,
      discoveryMethods: marketingInfo.discoveryMethods,
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
    const isDiscoveryMethodsEmpty =
      !marketingInfo.discoveryMethods ||
      marketingInfo.discoveryMethods.length === 0;
    const isOrganizationTypesEmpty =
      !marketingInfo.organizationTypes ||
      marketingInfo.organizationTypes.length === 0;

    setErrors({
      isJobTitleEmpty,
      isAudienceEmpty,
      isDesiredContentEmpty,
      isDiscoveryMethodsEmpty,
      isOrganizationTypesEmpty,
    });

    const validRegularFields =
      !isJobTitleEmpty && !isAudienceEmpty && !isDesiredContentEmpty;
    const validAdminFields =
      !isDiscoveryMethodsEmpty && !isOrganizationTypesEmpty;

    return validRegularFields && (!isAdmin || validAdminFields);
  };

  return (
    <Bodal
      closeOnClickOutside={false}
      displayCancelButton={false}
      showCloseIcon={false}
      onConfirm={handleUserUpdate}
      isLoading={isUserUpdating}
      footerClass={s.footer}
      title={
        isAdmin
          ? 'Tell us a bit more about you'
          : 'Your colleague has invited you to a Boclips Library preview!'
      }
      footerText={<FooterText />}
      confirmButtonText={"Let's Go!"}
    >
      <InvitedUserInfo />
      <MarketingInfoForm
        errors={errors}
        setMarketingInfo={setMarketingInfo}
        isAdmin={isAdmin}
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
