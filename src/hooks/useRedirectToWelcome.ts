import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAccount, useGetUserQuery } from 'src/hooks/api/userQuery';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import { AccountType } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

const useRedirectToWelcome = () => {
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

    if (isUserInTrial && !isMarketingInfoSetForUser) {
      navigate('/welcome');
    }
  }, [user, account, userLoading, accountLoading, navigate]);
};

const isMarketingInfoSet = (user: User): boolean => {
  const isJobTitleSet = user.jobTitle?.trim().length > 0;
  const isAudienceSet = user.audience?.trim().length > 0;
  const isDesiredContentSet = user.desiredContent?.trim().length > 0;

  return isJobTitleSet && isAudienceSet && isDesiredContentSet;
};

export default useRedirectToWelcome;
