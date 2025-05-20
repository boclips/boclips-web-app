import { useEffect } from 'react';
import { Constants } from 'src/AppConstants';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { useGetUserQuery } from 'src/hooks/api/userQuery';

const SubdomainRedirector = () => {
  const { data: user } = useGetUserQuery();

  useEffect(() => {
    if (!user?.account?.products) {
      return;
    }

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
        return;
    }

    if (targetHost && targetHost !== currentHost) {
      const newUrl = window.location.href.replace(currentHost, targetHost);
      window.location.replace(newUrl);
    }
  }, [user]);

  return null;
};

export default SubdomainRedirector;
