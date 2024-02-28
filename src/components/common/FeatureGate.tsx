import React from 'react';
import useFeatureFlags from 'src/hooks/useFeatureFlags';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { AdminLinks } from 'boclips-api-client/dist/types';
import { Loading } from 'src/components/common/Loading';
import { FeatureKey } from 'boclips-api-client/dist/sub-clients/common/model/FeatureKey';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import useUserProducts from 'src/hooks/useUserProducts';

interface FeatureGateProps {
  children: React.ReactElement | React.ReactElement[];
  fallback?: React.ReactElement;
  isView?: boolean;
}

type OptionalProps =
  | { linkName: keyof AdminLinks; feature?: never; product?: never }
  | { feature: FeatureKey; linkName?: never; product?: never }
  | { product: Product; linkName?: never; feature?: never };

export const FeatureGate = (props: FeatureGateProps & OptionalProps) => {
  const { feature, children, linkName, fallback, isView, product } = props;
  const links = useBoclipsClient().links;
  const { features, isLoading } = useFeatureFlags();
  const { products, isLoading: isProductsLoading } = useUserProducts();

  if (isLoading || isProductsLoading) {
    return isView ? <Loading /> : null;
  }

  if (product) {
    const hasProduct = products?.some((p) => p === product);
    if (hasProduct) {
      return <>{children}</>;
    }
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
