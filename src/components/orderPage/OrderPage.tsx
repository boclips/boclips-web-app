import React from 'react';
import {
  Order,
  OrderStatus,
} from 'boclips-api-client/dist/sub-clients/orders/model/Order';
import { OrderSummary } from 'src/components/orderPage/OrderSummary';
import { OrderVideoList } from 'src/components/orderPage/OrderVideoList';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';

interface Props {
  order: Order;
}

export const OrderPage = ({ order }: Props) => {
  const apiClient = useBoclipsClient();
  const onAssetDownload =
    order.status === OrderStatus.READY
      ? async () => {
          await apiClient.orders.updateOrder(order, {
            status: OrderStatus.DELIVERED,
          });
        }
      : () => {};

  return (
    <>
      <OrderSummary order={order} />
      <OrderVideoList order={order} onAssetDownload={onAssetDownload} />
    </>
  );
};
