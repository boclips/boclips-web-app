import React from 'react';
import { Typography } from 'boclips-ui';
import Arrow from '@resources/icons/grey-arrow.svg?react';
import { Link } from '../common/Link';

export const OrderHeader = ({ id }: { id?: string }) => {
  return (
    <nav
      aria-label="Orders"
      className="grid-row-start-2 grid-row-end-2 col-start-2 col-end-26 flex flex-row items-center"
    >
      <Link to="/orders" className="mr-4">
        <Typography.Body size="small" weight="medium">
          My orders
        </Typography.Body>
      </Link>
      <Arrow className="w-2  mr-4 self-center" />
      {id && (
        <Typography.Body
          as="div"
          size="small"
          className="text-gray-800"
        >{`Order ${id}`}</Typography.Body>
      )}
    </nav>
  );
};
