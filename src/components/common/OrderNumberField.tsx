import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { Link } from 'react-router-dom';
import { OrderInformationField } from './OrderInformationField';

interface Props {
  id: string;
  isLink?: boolean;
}

export const OrderNumberField = ({ id, isLink = false }: Props) => (
  <OrderInformationField fieldName="Order number">
    {isLink ? (
      <Link data-qa="order-id" to={`/orders/${id}`}>
        <Typography.Body as="div" className="text-blue-800 underline">
          {id}
        </Typography.Body>
      </Link>
    ) : (
      <Typography.Body as="div">{id}</Typography.Body>
    )}
  </OrderInformationField>
);
