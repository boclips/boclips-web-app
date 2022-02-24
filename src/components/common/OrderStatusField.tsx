import React from 'react';
import { OrderStatus } from 'boclips-api-client/dist/sub-clients/orders/model/Order';
import { orderDeliveryStatus } from 'src/components/ordersTable/OrderDeliveryStatus';
import c from 'classnames';
import { OrderInformationField } from 'src/components/common/OrderInformationField';
import { Typography } from '@boclips-ui/typography';

interface Props {
  status: OrderStatus;
}

export const OrderStatusField = ({ status }: Props) => {
  const deliveryStatus = orderDeliveryStatus.get(status);

  return (
    <OrderInformationField fieldName="Status">
      <Typography.Body
        as="div"
        weight="medium"
        data-qa="order-status-field"
        className={c('text-gray-800', {
          'text-blue-700': deliveryStatus === 'PROCESSING',
        })}
      >
        {deliveryStatus || '-'}
      </Typography.Body>
    </OrderInformationField>
  );
};
