import React from 'react';
import { Typography } from '@boclips-ui/typography';
import dayjs from 'dayjs';
import { OrderInformationField } from './OrderInformationField';

interface Props {
  date?: Date;
  fieldName: string;
}

export const OrderDateField = ({ date, fieldName }: Props) => (
  <OrderInformationField fieldName={fieldName}>
    <Typography.Body
      as="div"
      data-qa={`${fieldName.replace(' ', '-').toLowerCase()}-field`}
      className="text-gray-900"
    >
      {date ? dayjs(date).format('DD/MM/YY') : '-'}
    </Typography.Body>
  </OrderInformationField>
);
