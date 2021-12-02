import React from 'react';
import { Cart as ApiCart } from 'boclips-api-client/dist/sub-clients/carts/model/Cart';

interface Props {
  cart: ApiCart;
}

export const CartSummary = ({ cart }: Props) => {
  return (
    <div className="col-start-2 col-end-26 grid-row-start-2 grid-row-end-2 flex flex-row">
      <div className="font-bold text-2xl">Shopping cart</div>
      {!!cart.items.length && (
        <span className="text-2xl pl-3">
          ({cart.items.length} item
          {cart.items.length > 1 ? 's' : ''})
        </span>
      )}
    </div>
  );
};
