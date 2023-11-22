import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetAccount, useGetUserQuery } from 'src/hooks/api/userQuery';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import { AccountStatus } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

const UseRedirectToWelcome = () => {
  const navigate = useNavigate();
  const { data: user } = useGetUserQuery();
  const { data: account } = useGetAccount(user?.account?.id);
  const location = useLocation();
  useEffect(() => {
    if (account && account?.status === AccountStatus.TRIAL) {
      if (user && !marketingInfoSet(user)) {
        navigate('/welcome');
      } else {
        navigate('/');
      }
    } else if (location?.pathname === '/welcome') {
      navigate('/');
    }
  }, [user, marketingInfoSet, account]);

  return null;
};

const marketingInfoSet = (user: User) => {
  const isJobTitleSet = user.jobTitle?.trim().length > 0;
  const isAudienceSet = user.audience?.trim().length > 0;
  const isDesiredContentSet = user.desiredContent?.trim().length > 0;

  return isJobTitleSet || isAudienceSet || isDesiredContentSet;
};

export default UseRedirectToWelcome;
