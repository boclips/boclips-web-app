import React from 'react';
import useFeatureFlags from 'src/hooks/useFeatureFlags';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { AdminLinks } from 'boclips-api-client/dist/types';
import { Loading } from 'src/components/common/Loading';
import { FeatureKey } from 'boclips-api-client/dist/sub-clients/common/model/FeatureKey';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import useUserProducts from 'src/hooks/useUserProducts';
import { checkIsProduct } from 'src/services/checkIsProduct';
import { UserRole } from 'boclips-api-client/dist/sub-clients/users/model/UserRole';
import useUserRoles from 'src/hooks/useUserRole';

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
      excludedUserRoles?: never;
    }
  | {
      anyLinkName: AdminLinksKey[];
      linkName?: never;
      feature?: never;
      product?: never;
      excludedUserRoles?: never;
    }
  | {
      feature: FeatureKey;
      linkName?: never;
      product?: never;
      anyLinkName?: never;
      excludedUserRoles?: never;
    }
  | {
      product: Product;
      linkName?: never;
      feature?: never;
      anyLinkName?: never;
      excludedUserRoles?: never;
    }
  | {
      excludedUserRoles: UserRole[];
      linkName?: never;
      feature?: never;
      product?: never;
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
    excludedUserRoles,
  } = props;
  const links = useBoclipsClient().links;
  const { features, isLoading } = useFeatureFlags();
  const { products, isLoading: isProductsLoading } = useUserProducts();
  const { userRoles, isLoading: isUserRolesLoading } = useUserRoles();

  if (
    (feature && isLoading) ||
    (product && isProductsLoading) ||
    (excludedUserRoles && isUserRolesLoading)
  ) {
    return isView ? <Loading /> : null;
  }

  const shouldShow = (() => {
    if (product) {
      return checkIsProduct(product, products);
    }

    if (linkName) {
      return Boolean(links?.[linkName]);
    }

    if (anyLinkName) {
      return (anyLinkName as AdminLinksKey[]).some((key) => links?.[key]);
    }

    if (feature) {
      return Boolean(features?.[feature]);
    }

    if (excludedUserRoles) {
      for (const key in userRoles) {
        if ((excludedUserRoles as UserRole[]).includes(userRoles[key])) {
          return false;
        }
      }
      return true;
    }

    return false;
  })();

  return <>{shouldShow ? children : fallback}</>;
};
