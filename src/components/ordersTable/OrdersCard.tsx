import { Order } from 'boclips-api-client/dist/sub-clients/orders/model/Order';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@boclips-ui/button';
import { OrderThumbnail } from 'src/components/ordersTable/OrderThumbnail';
import { OrderStatusField } from 'src/components/common/OrderStatusField';
import { OrderDateField } from 'src/components/common/OrderDateField';
import { OrderNumberField } from 'src/components/common/OrderNumberField';
import { OrderTotalPriceField } from '../common/OrderTotalPriceField';

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
    <div className="flex flex-row flex-nowrap content-start items-center border-b-2 border-gray-400 py-6 text-gray-700 last:border-0">
      <OrderThumbnail items={order.items} />
      <OrderDateField fieldName="Order date" date={order.createdAt} />
      <OrderNumberField id={order.id} isLink />
      <OrderTotalPriceField totalPrice={order.totalPrice} />
      <OrderStatusField status={order.status} />
      <OrderDateField fieldName="Delivery date" date={order.deliveredAt} />
      <Button
        width="143px"
        height="44px"
        text="View order"
        onClick={goToOrder}
      />
    </div>
  );
};
