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
export const OrderTotalPriceField = ({ totalPrice, highlighted }: Props) => (
  <OrderInformationField fieldName="Total price">
    <Typography.Body
      data-qa="total-price-field"
      weight={highlighted ? 'medium' : null}
      className="text-gray-800"
    >
      {createPriceDisplayValue(
        totalPrice?.value,
        totalPrice?.currency,
        getBrowserLocale(),
      )}
    </Typography.Body>
  </OrderInformationField>
);
