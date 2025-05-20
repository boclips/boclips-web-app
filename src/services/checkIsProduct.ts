import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { Constants } from 'src/AppConstants';

export const checkIsProduct = (
  product: Product,
  userProducts: Product[],
): boolean => {
  const host = window.location.host;

  if (
    (product === Product.CLASSROOM && host === Constants.CLASSROOM_HOST) ||
    (product === Product.LIBRARY && host === Constants.LIBRARY_HOST)
  ) {
    return true;
  }

  return userProducts.includes(product);
};
