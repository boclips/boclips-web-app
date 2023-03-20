import React from 'react';
import dateFormat from 'dateformat';
import { Typography } from '@boclips-ui/typography';
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
      {date ? dateFormat(date, 'dd/mm/yy') : '-'}
    </Typography.Body>
  </OrderInformationField>
);
