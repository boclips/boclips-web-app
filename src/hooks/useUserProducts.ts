import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

type Products = {
  products?: Product[];
  isLoading: boolean;
};

function useUserProducts(): Products {
  const { data: user, isLoading } = useGetUserQuery();
  return {
    products: user?.account.products,
    isLoading,
  };
}

export default useUserProducts;
