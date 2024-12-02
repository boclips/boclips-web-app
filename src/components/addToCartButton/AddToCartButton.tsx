import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  doAddToCart,
  doDeleteFromCart,
  useCartQuery,
} from '@src/hooks/api/cartQuery';
import { Cart } from 'boclips-api-client/dist/sub-clients/carts/model/Cart';
import Button from 'boclips-ui';
import React from 'react';
import c from 'classnames';
import CartIcon from '@resources/icons/cart-icon.svg';
import AnalyticsFactory from '@src/services/analytics/AnalyticsFactory';
import {
  trackVideoAddedToCart,
  trackVideoRemovedFromCart,
} from '@components/common/analytics/Analytics';
import { Video } from 'boclips-api-client/dist/types';
import { displayNotification } from '@components/common/notification/displayNotification';
import { HotjarEvents } from '@src/services/analytics/hotjar/Events';
import Tooltip from 'boclips-ui';
import { useBoclipsClient } from '@components/common/providers/BoclipsClientProvider';
import s from './style.module.less';

interface AddToCartButtonProps {
  video: Video;
  width?: string;
  removeButtonWidth?: string;
  onClick?: () => void;
  iconOnly?: boolean;
}

export const AddToCartButton = ({
  video,
  width,
  onClick,
  removeButtonWidth,
  iconOnly = false,
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
        queryClient.setQueryData(['cart'], (old: Cart) => ({
          ...old,
          items: [...old.items, it],
        }));

        displayNotification(
          'success',
          'Video added to cart',
          '',
          `add-video-${it.id}-to-cart-notification`,
        );

        if (onClick) {
          onClick();
        }
        videoAddedHotjarEvent();
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
        queryClient.setQueryData(['cart'], (old: Cart) => ({
          ...old,
          items: [...old.items.filter((item) => item.id !== it)],
        }));

        displayNotification(
          'success',
          'Video removed from cart',
          '',
          `remove-video-${it}-from-cart-notification`,
        );

        videoRemovedHotjarEvent();
      },
    },
  );

  const addToCart = () => {
    trackVideoAddedToCart(video, boclipsClient);
    mutateAddToCart(video.id);
  };

  const videoAddedHotjarEvent = () => {
    AnalyticsFactory.hotjar().event(HotjarEvents.VideoAddedToCart);
  };

  const videoRemovedHotjarEvent = () => {
    AnalyticsFactory.hotjar().event(HotjarEvents.VideoRemovedFromCart);
  };

  const removeFromCart = () => {
    trackVideoRemovedFromCart(video, boclipsClient);
    mutateDeleteFromCart(cartItem.id);
  };

  const addToCartButtonWidth = iconOnly ? '40px' : width;
  const removeFromCartButtonWidth = iconOnly
    ? '40px'
    : removeButtonWidth || width;
  const button = (
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
          dataQa="add-to-cart-button"
          text="Add to cart"
          aria-label="Add to cart"
          icon={<CartIcon />}
          width={iconOnly ? '40px' : '100%'}
          height="40px"
          iconOnly={iconOnly}
        />
      ) : (
        <Button
          onClick={removeFromCart}
          dataQa="remove-from-cart-button"
          type="outline"
          text="Remove"
          aria-label="Remove from cart"
          icon={<CartIcon />}
          width={iconOnly ? '40px' : '100%'}
          height="40px"
          iconOnly={iconOnly}
        />
      )}
    </div>
  );
  return iconOnly ? (
    <Tooltip text={cartItem ? 'Remove from cart' : 'Add to cart'}>
      {button}
    </Tooltip>
  ) : (
    button
  );
};

export default AddToCartButton;
