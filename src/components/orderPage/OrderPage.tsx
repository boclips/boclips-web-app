import React from 'react';
import { Order } from 'boclips-api-client/dist/sub-clients/orders/model/Order';
import { OrderSummary } from '@components/orderPage/OrderSummary';
import { OrderVideoList } from '@components/orderPage/OrderVideoList';

interface Props {
  order: Order;
}

export const OrderPage = ({ order }: Props) => {
  return (
    <>
      <OrderSummary order={order} />
      <OrderVideoList order={order} />
    </>
  );
};
