import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAccount, useGetUserQuery } from 'src/hooks/api/userQuery';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import {
  Account,
  AccountType,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

interface Props {
  showPopup: (arg: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

const useShowTrialWelcomeModal = ({ showPopup, setIsAdmin }: Props) => {
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useGetUserQuery();
  const { data: account, isLoading: accountLoading } = useGetAccount(
    user?.account?.id,
  );
  useEffect(() => {
    if (userLoading || accountLoading) {
      return;
    }
    const isUserInTrial = account?.type === AccountType.TRIAL;
    const isMarketingInfoSetForUser = user && isMarketingInfoSet(user);
    const isMarketingInfoSetForAccount =
      account && isAccountMarketingInfoSet(account);

    if (isUserInTrial && !isMarketingInfoSetForUser) {
      showPopup(true);
      setIsAdmin(!isMarketingInfoSetForAccount);
    }
  }, [
    user,
    account,
    userLoading,
    accountLoading,
    navigate,
    showPopup,
    setIsAdmin,
  ]);
};

const isMarketingInfoSet = (user: User): boolean => {
  const isJobTitleSet = user.jobTitle?.trim().length > 0;
  const isAudienceSet = user.audience?.trim().length > 0;
  const isDesiredContentSet = user.desiredContent?.trim().length > 0;
  const isDiscoveryMethodSet = user.discoveryMethods?.length > 0;

  return (
    isJobTitleSet &&
    isAudienceSet &&
    isDesiredContentSet &&
    isDiscoveryMethodSet
  );
};

const isAccountMarketingInfoSet = (account: Account): boolean => {
  return account.marketingInformation?.companySegments?.length > 0;
};

export default useShowTrialWelcomeModal;
