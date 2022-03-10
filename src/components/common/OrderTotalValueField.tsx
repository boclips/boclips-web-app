import React from 'react';
import { createPriceDisplayValue } from 'src/services/createPriceDisplayValue';
import { OrderPrice } from 'boclips-api-client/dist/sub-clients/orders/model/OrderPrice';
import { getBrowserLocale } from 'src/services/getBrowserLocale';
import { Typography } from '@boclips-ui/typography';
import { OrderInformationField } from './OrderInformationField';

interface Props {
  totalPrice: OrderPrice;
  highlighted?: boolean;
}
export const OrderTotalValueField = ({ totalPrice, highlighted }: Props) => (
  <OrderInformationField fieldName="Total value">
    <Typography.Body
      weight={highlighted ? 'medium' : null}
      className="text-gray-900"
    >
      {createPriceDisplayValue(
        totalPrice?.value,
        totalPrice?.currency,
        getBrowserLocale(),
      )}
    </Typography.Body>
  </OrderInformationField>
);
