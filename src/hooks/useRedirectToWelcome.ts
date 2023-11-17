import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAccount, useGetUserQuery } from 'src/hooks/api/userQuery';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import { AccountStatus } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

const useRedirectToWelcome = () => {
  const navigate = useNavigate();
  const { data: user } = useGetUserQuery();
  const { data: account } = useGetAccount(user?.account?.id);

  return useEffect(() => {
    if (
      user &&
      account &&
      // account.status === AccountStatus.TRIAL &&
      userHasNoMarketingInfo(user)
    ) {
      navigate('/welcome');
    }
  }, [user, account]);
};

const userHasNoMarketingInfo = (user: User) => {
  const isJobTitleEmpty = !user.jobTitle?.trim();
  const isAudienceEmpty = !user.audience?.trim();
  const isDesiredContentEmpty = !user.desiredContent?.trim();

  return isJobTitleEmpty || isAudienceEmpty || isDesiredContentEmpty;
};

export default useRedirectToWelcome;
