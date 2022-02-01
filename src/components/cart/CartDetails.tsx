import React from 'react';
import { doUpdateCartNote } from 'src/hooks/api/cartQuery';
import { InputWithDebounce as CartNote } from 'src/components/cart/InputWithDebounce';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { useMutation } from 'react-query';
import { Cart as ApiCart } from 'boclips-api-client/dist/sub-clients/carts/model/Cart';
import CartItem from './CartItem/CartItem';

interface Props {
  cart: ApiCart;
}

export const CartDetails = ({ cart }: Props) => {
  const apiClient = useBoclipsClient();
  const { mutate: onUpdateNote } = useMutation((note: string) =>
    doUpdateCartNote(note, apiClient),
  );

  return (
    <div className="col-start-2 col-end-19 font-medium text-md row-start-3 row-end-3 flex flex-col">
      <CartNote
        currentValue={cart?.note}
        onUpdate={onUpdateNote}
        placeholder="Add a note about this order (optional)"
      />
      <div className="pt-4 font-medium text-sm col-start-1 col-span-20 border-b-2">
        {cart.items.map((item) => (
          <CartItem key={item.id} cartItem={item} />
        ))}
      </div>
    </div>
  );
};
