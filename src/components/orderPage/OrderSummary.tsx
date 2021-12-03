import { Order } from 'boclips-api-client/dist/sub-clients/orders/model/Order';

import React from 'react';
import { OrderDateField } from 'src/components/common/OrderDateField';
import { OrderStatusField } from 'src/components/common/OrderStatusField';
import { OrderInformationField } from 'src/components/common/OrderInformationField';
import { OrderVideoQuantity } from 'src/components/common/OrderVideoQuantityField';
import { OrderTotalPriceField } from '../common/OrderTotalPriceField';

interface Props {
  order: Order;
}

export const OrderSummary = ({ order }: Props) => {
  return (
    <div className="grid-row-start-3 grid-row-end-3 col-start-2 col-end-26">
      <div className="flex justify-between mb-3">
        <div className="text-2xl font-bold text-gray-800 mb-4 ">{`Order ${order?.id}`}</div>
        <div className="text-base text-right w-64">
          To edit or cancel this order, please contact{' '}
          <a
            href="mailto:delivery@boclips.com"
            className="font-medium text-blue-800"
          >
            delivery@boclips.com
          </a>
        </div>
      </div>
      <div className="flex flex-row flex-wrap border-2 border-blue-500 rounded p-6">
        <OrderDateField fieldName="Order date" date={order?.createdAt} />
        <OrderStatusField status={order?.status} />
        <OrderDateField fieldName="Delivery date" date={order?.deliveredAt} />
        <OrderTotalPriceField highlighted totalPrice={order?.totalPrice} />
        <OrderVideoQuantity
          videoQuantity={`${order?.items.length} video${
            order?.items.length > 1 ? 's' : ''
          }`}
          fieldName="Quantity"
        />
        {order?.note && (
          <span className="mt-4 w-full">
            <OrderInformationField fieldName="Notes">
              <div className="text-base">{order.note}</div>
            </OrderInformationField>
          </span>
        )}
      </div>
    </div>
  );
};
