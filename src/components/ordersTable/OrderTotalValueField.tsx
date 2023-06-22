import React from 'react';
import { OrderPrice } from 'boclips-api-client/dist/sub-clients/orders/model/OrderPrice';
import { Typography } from '@boclips-ui/typography';
import { PriceBadge } from 'src/components/common/price/PriceBadge';
import { OrderInformationField } from './OrderInformationField';

interface Props {
  totalPrice: OrderPrice;
  highlighted?: boolean;
}
export const OrderTotalValueField = ({ totalPrice, highlighted }: Props) => (
  <OrderInformationField fieldName="Total value">
    <Typography.Body
      data-qa="total-value-field"
      weight={highlighted ? 'medium' : null}
      className="text-gray-900"
    >
      {totalPrice && (
        <PriceBadge
          price={{ amount: totalPrice.value, currency: totalPrice.currency }}
        />
      )}
    </Typography.Body>
  </OrderInformationField>
);
