import React from 'react';
import useFeatureFlags from 'src/hooks/useFeatureFlags';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { AdminLinks } from 'boclips-api-client/dist/types';
import { Loading } from 'src/components/common/Loading';
import { FeatureKey } from 'boclips-api-client/dist/sub-clients/common/model/FeatureKey';

interface FeatureGateProps {
  children: React.ReactElement | React.ReactElement[];
  fallback?: React.ReactElement;
  isView?: boolean;
}

type OptionalProps =
  | { linkName: keyof AdminLinks; feature?: never }
  | { feature: FeatureKey; linkName?: never };

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
