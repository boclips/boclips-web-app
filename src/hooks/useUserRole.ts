import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { UserRole } from 'boclips-api-client/dist/sub-clients/users/model/UserRole';

type UserRoleResult = {
  userRoles?: {
    [key in Product]?: UserRole;
  };
  isLoading: boolean;
};

function useUserRoles(): UserRoleResult {
  const { data: user, isLoading } = useGetUserQuery();
  return {
    userRoles: user?.userRoles || {},
    isLoading,
  };
}

export default useUserRoles;
