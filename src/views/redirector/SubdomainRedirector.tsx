import { useEffect } from 'react';
import { Constants } from 'src/AppConstants';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { useQuery } from '@tanstack/react-query';
import { doGetUser } from 'src/hooks/api/userQuery';
import { BoclipsClient } from 'boclips-api-client';

export interface Props {
  apiClient: BoclipsClient;
}
const SubdomainRedirector = ({ apiClient }: Props) => {
  const { data: user } = useQuery(['user'], async () => doGetUser(apiClient));

  useEffect(() => {
    const currentHost = window.location.host;
    let targetHost: string | null = null;
    const userProducts = user.account.products;

    switch (currentHost) {
      case Constants.LEGACY_HOST:
        targetHost = userProducts.includes(Product.LIBRARY)
          ? Constants.LIBRARY_HOST
          : Constants.CLASSROOM_HOST;
        break;
      case Constants.CLASSROOM_HOST:
        if (!userProducts.includes(Product.CLASSROOM)) {
          targetHost = Constants.LIBRARY_HOST;
        }
        break;
      case Constants.LIBRARY_HOST:
        if (!userProducts.includes(Product.LIBRARY)) {
          targetHost = Constants.CLASSROOM_HOST;
        }
        break;
      default:
        console.log('Host does not match so not redirecting');
        return;
    }

    if (targetHost && targetHost !== currentHost) {
      console.log(`Should redirect to ${targetHost}`);
      const newUrl = window.location.href.replace(currentHost, targetHost);
      window.location.replace(newUrl);
    }
  }, [user]);

  return null;
};

export default SubdomainRedirector;
