import { Typography } from '@boclips-ui/typography';
import React, { ReactElement } from 'react';

interface ItemProps {
  fieldName: string;
  children: ReactElement | 'string';
}

export const OrderInformationField = ({ fieldName, children }: ItemProps) => {
  return (
    <div className="flex flex-col flex-grow text-sm px-2">
      <Typography.Body
        as="div"
        size="small"
        weight="medium"
        className="text-grey-700"
      >
        {fieldName}
      </Typography.Body>
      {children}
    </div>
  );
};
