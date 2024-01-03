import { useGetAccount, useGetUserQuery } from 'src/hooks/api/userQuery';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AccountType } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';

export const useRedirectToHome = () => {
  const { data: user, isLoading: userLoading } = useGetUserQuery();
  const { data: account, isLoading: accountLoading } = useGetAccount(
    user?.account?.id,
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (userLoading || accountLoading) {
      return;
    }

    if (account.type !== AccountType.TRIAL) {
      navigate('/');
    } else if (isMarketingInfoSet(user)) {
      navigate('/');
    }
  }, [userLoading, user, accountLoading, account, navigate]);
};
const isMarketingInfoSet = (user: User): boolean =>
  user.desiredContent !== null &&
  user.audience !== null &&
  user.jobTitle !== null;
