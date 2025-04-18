import React from 'react';
import { doUpdateCartNote } from 'src/hooks/api/cartQuery';
import { TextAreaWithDebounce } from 'src/components/cart/TextAreaWithDebounce';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { useMutation } from '@tanstack/react-query';
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
    <main tabIndex={-1} className="col-start-2 col-end-19 flex flex-col">
      <TextAreaWithDebounce
        currentValue={cart?.note}
        onUpdate={onUpdateNote}
        placeholder="Add a note about this order"
      />
      <div className="pt-4 col-start-1 col-span-20">
        {cart.items.map((item) => (
          <CartItem key={item.videoId} cartItem={item} />
        ))}
      </div>
    </main>
  );
};
