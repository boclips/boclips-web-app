import { Order } from 'boclips-api-client/dist/sub-clients/orders/model/Order';

import React from 'react';
import { OrderDateField } from 'src/components/ordersTable/OrderDateField';
import { OrderStatusField } from 'src/components/ordersTable/OrderStatusField';
import { OrderInformationField } from 'src/components/ordersTable/OrderInformationField';
import { OrderVideoQuantity } from 'src/components/ordersTable/OrderVideoQuantityField';
import { Typography } from '@boclips-ui/typography';
import { OrderTotalValueField } from '../ordersTable/OrderTotalValueField';
import { Link } from '../common/Link';
import s from './style.module.less';

interface Props {
  order: Order;
}

export const OrderSummary = ({ order }: Props) => {
  return (
    <section
      className="grid-row-start-3 grid-row-end-3 col-start-2 col-end-26"
      aria-labelledby="order-number"
    >
      <div className="flex justify-between mb-3">
        <Typography.H1
          size="md"
          className="text-gray-800 mb-4"
          id="order-number"
          aria-label="Order number"
        >{`Order ${order?.id}`}</Typography.H1>
      </div>
      <div className={s.orderSummary}>
        <OrderDateField fieldName="Order date" date={order?.createdAt} />
        <OrderStatusField status={order?.status} />
        <OrderDateField fieldName="Delivery date" date={order?.deliveredAt} />
        <OrderTotalValueField highlighted totalPrice={order?.totalPrice} />
        <OrderVideoQuantity
          videoQuantity={`${order?.items.length} video${
            order?.items.length > 1 ? 's' : ''
          }`}
          fieldName="Quantity"
        />
        {order?.note && (
          <span className="mt-4 w-full">
            <OrderInformationField fieldName="Notes">
              <Typography.Body as="div">{order.note}</Typography.Body>
            </OrderInformationField>
          </span>
        )}
      </div>
      <Typography.Body className="w-64 text-gray-900">
        Please reach out to{' '}
        <Link isExternalLink to="mailto:support@boclips.com">
          <Typography.Link type="inline-blue" className="font-medium">
            support@boclips.com
          </Typography.Link>
        </Link>{' '}
        if you have any questions pertaining to your order
      </Typography.Body>
    </section>
  );
};
