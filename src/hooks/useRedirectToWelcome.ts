import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetAccount, useGetUserQuery } from 'src/hooks/api/userQuery';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import { AccountStatus } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

const UseRedirectToWelcome = () => {
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useGetUserQuery();
  const { data: account, isLoading: accountLoading } = useGetAccount(
    user?.account?.id,
  );
  const location = useLocation();
  useEffect(() => {
    if (userLoading || accountLoading) {
      return;
    }
    const isUserInTrial = account?.status === AccountStatus.TRIAL;
    const isMarketingInfoSetForUser = user && isMarketingInfoSet(user);
    const onWelcomeView = location?.pathname === '/welcome';

    if (isUserInTrial) {
      if (!isMarketingInfoSetForUser) {
        navigate('/welcome');
      } else if (onWelcomeView) {
        navigate('/');
      }
    } else if (onWelcomeView) {
      navigate('/');
    }
  }, [user, isMarketingInfoSet, account]);

  return null;
};

const isMarketingInfoSet = (user: User): boolean => {
  const isJobTitleSet = user.jobTitle?.trim().length > 0;
  const isAudienceSet = user.audience?.trim().length > 0;
  const isDesiredContentSet = user.desiredContent?.trim().length > 0;

  return isJobTitleSet && isAudienceSet && isDesiredContentSet;
};

export default UseRedirectToWelcome;
