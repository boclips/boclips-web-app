import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { Link } from '../common/Link';
import { OrderInformationField } from './OrderInformationField';

interface Props {
  id: string;
  isLink?: boolean;
}

export const OrderNumberField = ({ id, isLink = false }: Props) => (
  <OrderInformationField fieldName="Order number">
    {isLink ? (
      <Link type="inline-blue" data-qa="order-id" to={`/orders/${id}`}>
        <Typography.Body as="div" weight="medium">
          {id}
        </Typography.Body>
      </Link>
    ) : (
      <Typography.Body as="div">{id}</Typography.Body>
    )}
  </OrderInformationField>
);
