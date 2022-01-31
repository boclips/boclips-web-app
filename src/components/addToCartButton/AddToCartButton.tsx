import { useMutation, useQueryClient } from 'react-query';
import {
  doAddToCart,
  doDeleteFromCart,
  useCartQuery,
} from 'src/hooks/api/cartQuery';
import { Cart } from 'boclips-api-client/dist/sub-clients/carts/model/Cart';
import Button from '@boclips-ui/button';
import React from 'react';
import c from 'classnames';
import CartIcon from 'resources/icons/cart-icon.svg';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import {
  trackVideoAddedToCart,
  trackVideoRemovedFromCart,
} from 'src/components/common/analytics/Analytics';
import { Video } from 'boclips-api-client/dist/types';
import s from './style.module.less';
import { useBoclipsClient } from '../common/providers/BoclipsClientProvider';

interface AddToCartButtonProps {
  video: Video;
  width?: string;
  appcueEvent?: AppcuesEvent;
}

export const AddToCartButton = ({
  video,
  width,
  appcueEvent,
}: AddToCartButtonProps) => {
  const queryClient = useQueryClient();
  const boclipsClient = useBoclipsClient();
  const { data: cart } = useCartQuery();

  const cartItem = cart?.items?.find((it) => it?.videoId === video.id);

  const { mutate: mutateAddToCart } = useMutation(
    (id: string) => {
      if (cartItem === undefined) {
        return doAddToCart(cart as Cart, id, boclipsClient);
      }
      return Promise.reject(new Error('Item already in cart'));
    },
    {
      onSuccess: (it) => {
        queryClient.setQueryData('cart', (old: Cart) => ({
          ...old,
          items: [...old.items, it],
        }));

        if (appcueEvent) {
          AnalyticsFactory.getAppcues().sendEvent(appcueEvent);
        }
      },
    },
  );

  const { mutate: mutateDeleteFromCart } = useMutation(
    async (cartItemId: string) => {
      if (cartItem) {
        return doDeleteFromCart(cart as Cart, cartItemId, boclipsClient);
      }
      return Promise.reject(new Error('Item is not in cart'));
    },
    {
      onSuccess: (it) => {
        queryClient.setQueryData('cart', (old: Cart) => ({
          ...old,
          items: [...old.items.filter((item) => item.id !== it)],
        }));
      },
    },
  );

  const addToCart = () => {
    trackVideoAddedToCart(video, boclipsClient);
    mutateAddToCart(video.id);
  };

  const removeFromCart = () => {
    trackVideoRemovedFromCart(video, boclipsClient);
    mutateDeleteFromCart(cartItem.id);
  };

  return (
    <div
      style={{ width }}
      className={c(`flex justify-end ${s.svgOutlineNone}`, {
        [s.svgOutline]: cartItem,
      })}
    >
      {!cartItem ? (
        <Button
          onClick={addToCart}
          text="Add to cart"
          icon={<CartIcon />}
          width="100%"
          height="40px"
        />
      ) : (
        <Button
          onClick={removeFromCart}
          type="outline"
          text="Remove"
          icon={<CartIcon />}
          width="100%"
          height="40px"
        />
      )}
    </div>
  );
};

export default AddToCartButton;
