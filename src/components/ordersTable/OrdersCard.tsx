import { Order } from 'boclips-api-client/dist/sub-clients/orders/model/Order';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@boclips-ui/button';
import { OrderThumbnail } from 'src/components/ordersTable/OrderThumbnail';
import { OrderStatusField } from 'src/components/common/OrderStatusField';
import { OrderDateField } from 'src/components/common/OrderDateField';
import { OrderNumberField } from 'src/components/common/OrderNumberField';
import { OrderTotalValueField } from '../common/OrderTotalValueField';
import s from './style.module.less';

interface Props {
  order: Order;
}

export const OrdersCard = ({ order }: Props) => {
  const history = useHistory();

  const goToOrder = () => {
    history.push({
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
