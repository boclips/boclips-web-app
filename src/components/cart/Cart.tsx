import React from 'react';
import { Cart as ApiCart } from 'boclips-api-client/dist/sub-clients/carts/model/Cart';
import { CartValidationProvider } from '@components/common/providers/CartValidationProvider';
import { CartOrderSummary } from './CartOrderSummary';
import { CartDetails } from './CartDetails';

interface Props {
  cart: ApiCart;
}

export const Cart = ({ cart }: Props) => {
  return (
    <CartValidationProvider>
      <CartDetails cart={cart} />
      <CartOrderSummary cart={cart} />
    </CartValidationProvider>
  );
};
