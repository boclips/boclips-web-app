import React from 'react';
import useFeatureFlags from '@src/hooks/useFeatureFlags';
import { useBoclipsClient } from '@components/common/providers/BoclipsClientProvider';
import { AdminLinks } from 'boclips-api-client/dist/types';
import { Loading } from '@components/common/Loading';
import { FeatureKey } from 'boclips-api-client/dist/sub-clients/common/model/FeatureKey';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import useUserProducts from '@src/hooks/useUserProducts';

interface FeatureGateProps {
  children: React.ReactElement | React.ReactElement[];
  fallback?: React.ReactElement;
  isView?: boolean;
}

export type AdminLinksKey = keyof AdminLinks;

type OptionalProps =
  | {
      linkName: AdminLinksKey;
      feature?: never;
      product?: never;
      anyLinkName?: never;
    }
  | {
      anyLinkName: AdminLinksKey[];
      linkName?: never;
      feature?: never;
      product?: never;
    }
  | {
      feature: FeatureKey;
      linkName?: never;
      product?: never;
      anyLinkName?: never;
    }
  | {
      product: Product;
      linkName?: never;
      feature?: never;
      anyLinkName?: never;
    };

export const FeatureGate = (props: FeatureGateProps & OptionalProps) => {
  const {
    feature,
    children,
    linkName,
    fallback,
    isView,
    product,
    anyLinkName,
  } = props;
  const links = useBoclipsClient().links;
  const { features, isLoading } = useFeatureFlags();
  const { products, isLoading: isProductsLoading } = useUserProducts();

  if (isLoading || isProductsLoading) {
    return isView ? <Loading /> : null;
  }

  if (product && products) {
    const hasProduct = products?.some((p) => p === product);
    if (hasProduct) {
      return <>{children}</>;
    }
  }

  if (linkName && links) {
    const link = links[linkName];
    if (link) {
      return <>{children}</>;
    }
  }

  if (anyLinkName && links) {
    const hasAnyLink = (anyLinkName as AdminLinksKey[]).some((it) => links[it]);
    if (hasAnyLink) {
      return <>{children}</>;
    }
  }

  if (feature && features) {
    const isEnabled = features[feature];
    if (isEnabled) {
      return <>{children}</>;
    }
  }

  return <>{fallback}</>;
};
