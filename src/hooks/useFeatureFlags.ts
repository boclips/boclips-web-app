import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { FeatureKey } from 'boclips-api-client/dist/sub-clients/common/model/FeatureKey';

type UserFeatures = {
  [key in FeatureKey]?: boolean;
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
