import React, { useState } from 'react';
import { Bodal } from 'src/components/common/bodal/Bodal';
import MarketingInfoForm from 'src/components/welcome/MarketingInfoForm';
import InvitedUserInfo from 'src/components/welcome/InvitedUserInfo';
import { useGetUserQuery, useUpdateSelfUser } from 'src/hooks/api/userQuery';
import {
  UpdateUserRequest,
  UserType,
} from 'boclips-api-client/dist/sub-clients/users/model/UpdateUserRequest';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { useUpdateAccount } from 'src/hooks/api/accountQuery';
import { UpdateAccountRequest } from 'boclips-api-client/dist/sub-clients/accounts/model/UpdateAccountRequest';
import { TermsAndConditionsCheckbox } from 'src/components/common/TermsAndConditionsCheckbox';

export interface MarketingInfo {
  audiences: string[];
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
  const { mutate: updateSelfUser, isLoading: isUserUpdating } =
    useUpdateSelfUser();
  const { data: user } = useGetUserQuery();
  const { mutate: updateSelfAccount, isLoading: isAccountUpdating } =
    useUpdateAccount();

  const [marketingInfo, setMarketingInfo] = useState<MarketingInfo>({
    audiences: [],
    desiredContent: '',
    jobTitle: '',
    discoveryMethods: [],
    organizationTypes: [],
  });
  const [termsAndConditionsChecked, setTermsAndConditionsChecked] =
    useState(false);

  const [errors, setErrors] = useState({
    isAudiencesEmpty: false,
    isDesiredContentEmpty: false,
    isJobTitleEmpty: false,
    isDiscoveryMethodsEmpty: false,
    isOrganizationTypesEmpty: false,
    termsAndConditionsNotAccepted: false,
  });

  const updateAccount = (userRequest: UpdateUserRequest) => {
    const accountRequest: UpdateAccountRequest = {
      companySegments: marketingInfo.organizationTypes,
    };

    updateSelfAccount(
      { accountId: user.account.id, request: accountRequest },
      {
        onSuccess: () => updateUser(userRequest),
        onError: (error: Error) => {
          displayNotification('error', 'Account update failed', error?.message);
        },
      },
    );
  };

  const updateUser = (userRequest: UpdateUserRequest) => {
    updateSelfUser(
      { user, request: userRequest },
      {
        onSuccess: () => {
          displayNotification(
            'success',
            `User ${user.email} successfully updated`,
          );
          showPopup(false);
        },
        onError: (error: Error) => {
          displayNotification('error', 'User update failed', error?.message);
        },
      },
    );
  };

  const handleUserUpdate = () => {
    if (!user || !validateForm()) return;

    const userRequest: UpdateUserRequest = {
      type: UserType.b2bUser,
      jobTitle: marketingInfo.jobTitle,
      audiences: marketingInfo.audiences,
      desiredContent: marketingInfo.desiredContent,
      discoveryMethods: marketingInfo.discoveryMethods,
    };

    if (isAdmin) {
      updateAccount(userRequest);
    } else {
      updateUser({
        ...userRequest,
        ...{ hasAcceptedTermsAndConditions: termsAndConditionsChecked },
      });
    }
  };

  const validateForm = (): boolean => {
    const isJobTitleEmpty = !marketingInfo.jobTitle.trim();
    const isAudiencesEmpty =
      !marketingInfo.audiences || marketingInfo.audiences.length === 0;
    const isDesiredContentEmpty = !marketingInfo.desiredContent.trim();
    const isDiscoveryMethodsEmpty =
      !marketingInfo.discoveryMethods ||
      marketingInfo.discoveryMethods.length === 0;
    const isOrganizationTypesEmpty =
      !marketingInfo.organizationTypes ||
      marketingInfo.organizationTypes.length === 0;
    const termsAndConditionsNotAccepted = !termsAndConditionsChecked;

    setErrors({
      isJobTitleEmpty,
      isAudiencesEmpty,
      isDesiredContentEmpty,
      isDiscoveryMethodsEmpty,
      isOrganizationTypesEmpty,
      termsAndConditionsNotAccepted,
    });

    const validRegularFields =
      !isJobTitleEmpty && !isAudiencesEmpty && !isDesiredContentEmpty;

    const validAdminFields =
      !isDiscoveryMethodsEmpty && !isOrganizationTypesEmpty;

    return (
      validRegularFields &&
      (!isAdmin || validAdminFields) &&
      (isAdmin || !termsAndConditionsNotAccepted)
    );
  };

  return (
    <Bodal
      closeOnClickOutside={false}
      displayCancelButton={false}
      showCloseIcon={false}
      onCancel={() => null}
      onConfirm={handleUserUpdate}
      isLoading={isUserUpdating || isAccountUpdating}
      title={
        isAdmin
          ? 'Tell us a bit more about you'
          : 'Your colleague has invited you to Boclips Library!'
      }
      confirmButtonText={"Let's Go!"}
    >
      <InvitedUserInfo />
      <MarketingInfoForm
        errors={errors}
        setMarketingInfo={setMarketingInfo}
        isAdmin={isAdmin}
      />
      {!isAdmin && (
        <div className="mt-3">
          <TermsAndConditionsCheckbox
            handleChange={setTermsAndConditionsChecked}
            isInvalid={errors.termsAndConditionsNotAccepted}
          />
        </div>
      )}
    </Bodal>
  );
};
export default WelcomeModal;
