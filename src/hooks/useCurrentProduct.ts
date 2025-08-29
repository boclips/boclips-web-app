import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { checkIsProduct } from 'src/services/checkIsProduct';

function useCurrentProduct(): Product {
  return checkIsProduct(Product.CLASSROOM, [])
    ? Product.CLASSROOM
    : Product.LIBRARY;
}

export default useCurrentProduct;
