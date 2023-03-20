import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { OrderInformationField } from 'src/components/ordersTable/OrderInformationField';

interface Props {
  videoQuantity: string;
  fieldName: string;
}

export const OrderVideoQuantity = ({ videoQuantity, fieldName }: Props) => (
  <OrderInformationField fieldName={fieldName}>
    <Typography.Body as="div" data-qa="video-quantity">
      {videoQuantity}
    </Typography.Body>
  </OrderInformationField>
);
