import { Link } from 'react-router-dom';
import React from 'react';
import { Typography } from '@boclips-ui/typography';
import Arrow from '../../resources/icons/grey-arrow.svg';

export const OrderHeader = ({ id }: { id?: string }) => {
  return (
    <section className="grid-row-start-2 grid-row-end-2 col-start-2 col-end-26 flex flex-row items-center">
      <Link to="/orders" className="mr-4 text-gray-800 hover:text-gray-800">
        <Typography.Body size="small" weight="medium">
          Your orders
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
    </section>
  );
};
