import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { UserFeatureKey } from 'boclips-api-client/dist/sub-clients/organisations/model/User';

type UserFeatures = {
  [key in UserFeatureKey]?: boolean;
};

type FeatureFlags = {
  features?: UserFeatures;
  isLoading: boolean;
};

function useFeatureFlags(): FeatureFlags {
  const { data: user, isLoading } = useGetUserQuery();
  return {
    features: user?.features,
    isLoading,
  };
}

export default useFeatureFlags;
