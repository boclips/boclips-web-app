import { Order } from 'boclips-api-client/dist/sub-clients/orders/model/Order';

import React from 'react';
import { OrderDateField } from 'src/components/common/OrderDateField';
import { OrderStatusField } from 'src/components/common/OrderStatusField';
import { OrderInformationField } from 'src/components/common/OrderInformationField';
import { OrderVideoQuantity } from 'src/components/common/OrderVideoQuantityField';
import { Typography } from '@boclips-ui/typography';
import { OrderTotalValueField } from '../common/OrderTotalValueField';
import { Link } from '../common/Link';
import s from './style.module.less';

interface Props {
  order: Order;
}

export const OrderSummary = ({ order }: Props) => {
  return (
    <div className="grid-row-start-3 grid-row-end-3 col-start-2 col-end-26">
      <div className="flex justify-between mb-3">
        <Typography.H1
          size="md"
          className="text-gray-800 mb-4"
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
        To edit or cancel this order, please contact{' '}
        <Link isMail to="mailto:support@boclips.com">
          <Typography.Body as="a" weight="medium" className="text-blue-800">
            support@boclips.com
          </Typography.Body>
        </Link>
      </Typography.Body>
    </div>
  );
};
