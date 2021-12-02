import { Link } from 'react-router-dom';
import React from 'react';
import Arrow from '../../resources/icons/grey-arrow.svg';

export const OrderHeader = ({ id }: { id?: string }) => {
  return (
    <div className="grid-row-start-2 grid-row-end-2 col-start-2 col-end-26">
      <div className="flex flex-row items-center">
        <Link
          to="/orders"
          className="text-sm mr-4 text-gray-800 hover:text-gray-800"
        >
          Your orders
        </Link>
        <Arrow className="w-2  mr-4 self-center" />
        {id && <div className="text-sm text-gray-800">{`Order ${id}`}</div>}
      </div>
    </div>
  );
};
