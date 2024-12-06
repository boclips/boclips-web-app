import { Order } from 'boclips-api-client/dist/sub-clients/orders/model/Order';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'boclips-ui';
import { OrderThumbnail } from '@components/ordersTable/OrderThumbnail';
import { OrderStatusField } from '@components/ordersTable/OrderStatusField';
import { OrderDateField } from '@components/ordersTable/OrderDateField';
import { OrderNumberField } from '@components/ordersTable/OrderNumberField';
import { OrderTotalValueField } from './OrderTotalValueField';
import s from './style.module.less';

interface Props {
  order: Order;
}

export const OrdersCard = ({ order }: Props) => {
  const navigate = useNavigate();

  const goToOrder = () => {
    navigate({
      pathname: `/orders/${order.id}`,
    });
  };

  return (
    <li className={s.orderCard}>
      <OrderThumbnail items={order.items} />
      <OrderDateField fieldName="Order date" date={order.createdAt} />
      <OrderNumberField id={order.id} isLink />
      <OrderTotalValueField totalPrice={order.totalPrice} />
      <OrderStatusField status={order.status} />
      <OrderDateField fieldName="Delivery date" date={order.deliveredAt} />
      <Button
        width="143px"
        height="44px"
        text="View order"
        onClick={goToOrder}
      />
    </li>
  );
};
