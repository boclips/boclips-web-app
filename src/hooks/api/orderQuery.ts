import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OrdersPage } from 'boclips-api-client/dist/sub-clients/orders/model/OrdersPage';
import { PlaceOrderRequest } from 'boclips-api-client/dist/sub-clients/orders/model/PlaceOrderRequest';
import { BoclipsClient } from 'boclips-api-client';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import { Order } from 'boclips-api-client/dist/sub-clients/orders/model/Order';

export interface OrdersQuery {
  page: number;
  size: number;
}

export const doPlaceOrder = (
  request: PlaceOrderRequest,
  client: BoclipsClient,
) => client.orders.placeOrder(request);

export const getOrders = (
  { page, size }: OrdersQuery,
  client: BoclipsClient,
): Promise<Pageable<Order>> => client.orders.getUserOrders(page, size);

export const getOrder = (id: string, client: BoclipsClient) =>
  client.orders.get(id);

export const usePlaceOrderQuery = () => {
  const boclipsClient = useBoclipsClient();

  return useMutation((request: PlaceOrderRequest) =>
    doPlaceOrder(request, boclipsClient),
  );
};

export const useGetOrdersQuery = (ordersQuery: OrdersQuery) => {
  const client = useBoclipsClient();
  return useQuery(['orders', ordersQuery], () =>
    getOrders(ordersQuery, client),
  );
};

export const useFindOrGetOrder = (orderId: string) => {
  const queryClient = useQueryClient();
  const boclipsClient = useBoclipsClient();

  return useQuery(['order', orderId], () => getOrder(orderId, boclipsClient), {
    initialData: () =>
      queryClient
        .getQueryData<OrdersPage>(['orders'])
        ?.orders.find((d) => d.id === orderId),
  });
};
