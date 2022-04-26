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
import { displayNotification } from 'src/components/common/notification/displayNotification';
import HotjarFactory from 'src/services/hotjar/HotjarFactory';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import s from './style.module.less';
import { useBoclipsClient } from '../common/providers/BoclipsClientProvider';
import { VideoAddedToCart } from 'src/services/hotjar/events/VideoAddedToCart';

interface AddToCartButtonProps {
  video: Video;
  width?: string;
  removeButtonWidth?: string;
  appcueEvent?: AppcuesEvent;
  labelAdd?: string;
}

export const AddToCartButton = ({
  video,
  width,
  appcueEvent,
  labelAdd = 'Add to cart',
  removeButtonWidth,
}: AddToCartButtonProps) => {
  const queryClient = useQueryClient();
  const boclipsClient = useBoclipsClient();

  const { data: cart } = useCartQuery();
  const { data: user } = useGetUserQuery();

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

        displayNotification(
          'success',
          'Video added to cart',
          '',
          `add-video-${it.id}-to-cart-notification`,
        );

        if (appcueEvent) {
          AnalyticsFactory.getAppcues().sendEvent(appcueEvent);
        }

        videoAddedHotjarEvent(it.videoId);
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

        displayNotification(
          'success',
          'Video removed from cart',
          '',
          `remove-video-${it}-from-cart-notification`,
        );
      },
    },
  );

  const addToCart = () => {
    trackVideoAddedToCart(video, boclipsClient);
    mutateAddToCart(video.id);
  };

  const videoAddedHotjarEvent = (videoId: string) => {
    const event = new VideoAddedToCart(user, videoId);
    HotjarFactory.hotjar().videoAddedToCart(event);
  };

  const removeFromCart = () => {
    trackVideoRemovedFromCart(video, boclipsClient);
    mutateDeleteFromCart(cartItem.id);
  };

  const addToCartButtonWidth = width;
  const removeFromCartButtonWidth = removeButtonWidth || width;
  return (
    <div
      style={{
        width: !cartItem ? addToCartButtonWidth : removeFromCartButtonWidth,
      }}
      className={c(`flex justify-end ${s.svgOutlineNone}`, {
        [s.svgOutline]: cartItem,
      })}
    >
      {!cartItem ? (
        <Button
          onClick={addToCart}
          text={labelAdd}
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
