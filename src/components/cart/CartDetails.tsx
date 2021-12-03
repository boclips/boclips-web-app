import React from 'react';
import { doUpdateCartNote } from 'src/hooks/api/cartQuery';
import { InputWithDebounce as CartNote } from 'src/components/cart/InputWithDebounce';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { useMutation } from 'react-query';
import { Video } from 'boclips-api-client/dist/types';
import { Cart as ApiCart } from 'boclips-api-client/dist/sub-clients/carts/model/Cart';
import VideoCardPlaceholder from '@boclips-ui/video-card-placeholder';
import CartItem from './CartItem/CartItem';

interface Props {
  cartItemVideos: Video[];
  cart: ApiCart;
}

export const CartDetails = ({ cartItemVideos, cart }: Props) => {
  const apiClient = useBoclipsClient();

  const { mutate: onUpdateNote } = useMutation((note: string) =>
    doUpdateCartNote(note, apiClient),
  );

  const singleCartItem = (videoId: string) => {
    return cart.items?.find((it) => it.videoId === videoId);
  };

  const displayCartItems = () => {
    const cartItems = cartItemVideos.map((item) => (
      <CartItem
        videoItem={item}
        key={item.id}
        cartItem={singleCartItem(item.id)}
      />
    ));

    if (cartItems.length === cart.items.length) return cartItems;

    return cart.items.map((items) => (
      <VideoCardPlaceholder
        displayHeader={false}
        key={`placeholder-${items.id}`}
      />
    ));
  };

  return (
    <div className="col-start-2 col-end-19 font-medium text-md row-start-3 row-end-3 flex flex-col">
      <CartNote
        currentValue={cart?.note}
        onUpdate={onUpdateNote}
        placeholder="Add a note about this order (optional)"
      />
      <div className="pt-4 font-medium text-sm col-start-1 col-span-20 border-b-2">
        {displayCartItems()}
      </div>
    </div>
  );
};
