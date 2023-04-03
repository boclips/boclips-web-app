import React from 'react';
import { UserFeatureKey } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import useFeatureFlags from 'src/hooks/useFeatureFlags';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { AdminLinks } from 'boclips-api-client/dist/types';
import { Loading } from 'src/components/common/Loading';

interface FeatureGateProps {
  children: React.ReactElement | React.ReactElement[];
  fallback?: React.ReactElement;
  isView?: boolean;
}

type OptionalProps =
  | { linkName: keyof AdminLinks; feature?: never }
  | { feature: UserFeatureKey; linkName?: never };

export const FeatureGate = (props: FeatureGateProps & OptionalProps) => {
  const { feature, children, linkName, fallback, isView } = props;
  const links = useBoclipsClient().links;
  const { features, isLoading } = useFeatureFlags();

  if (isLoading) {
    return isView ? <Loading /> : null;
  }

  if (linkName) {
    const link = links[linkName];
    if (link) {
      return <>{children}</>;
    }
  }

  if (feature) {
    const isEnabled = features[feature];
    if (isEnabled) {
      return <>{children}</>;
    }
  }

  return <>{fallback}</>;
};
