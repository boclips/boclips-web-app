import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Constants } from 'src/AppConstants';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { BoclipsClient } from 'boclips-api-client';
import { useQuery } from '@tanstack/react-query';
import { doGetUser } from 'src/hooks/api/userQuery';

export const useRedirectToCorrectSubdomain = (apiClient: BoclipsClient) => {
  const navigate = useNavigate();
  const { data: user } = useQuery(['user'], async () => doGetUser(apiClient));

  useEffect(() => {
    const redirectHost = (currentHost: string, newHost: string) => {
      const newUrl = window.location.href.replace(currentHost, newHost);
      navigate(newUrl, { replace: true });
    };

    switch (window.location.host) {
      case Constants.LEGACY_HOST:
        if (user.account.products.includes(Product.LIBRARY)) {
          console.log('Should redirect to library host');
          redirectHost(Constants.LEGACY_HOST, Constants.LIBRARY_HOST);
        } else {
          console.log('Should redirect to classroom host');
          redirectHost(Constants.LEGACY_HOST, Constants.CLASSROOM_HOST);
        }
        break;
      case Constants.CLASSROOM_HOST:
        if (!user.account.products.includes(Product.CLASSROOM)) {
          console.log('Should redirect to library host');
          redirectHost(Constants.CLASSROOM_HOST, Constants.LIBRARY_HOST);
        }
        break;
      case Constants.LIBRARY_HOST:
        if (!user.account.products.includes(Product.LIBRARY)) {
          console.log('Should redirect to library host');
          redirectHost(Constants.LIBRARY_HOST, Constants.CLASSROOM_HOST);
        }
        break;
      default:
        console.log('Host does not match so not redirecting');
    }
  }, [user, navigate]);
};
