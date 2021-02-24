import React, { useEffect, useState } from 'react';
import { Video } from 'boclips-api-client/dist/types';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import AdditionalServices from 'src/components/cart/AdditionalServices/AdditionalServices';
import { CartItem as ApiCartItem } from 'boclips-api-client/dist/sub-clients/carts/model/CartItem';
import Button from '@boclips-ui/button';
import RemoveFromCartIcon from 'src/resources/icons/bin.svg';
import { useCartMutation } from 'src/hooks/api/cartQuery';
import c from 'classnames';
import { Link } from 'react-router-dom';
import { createPriceDisplayValue } from 'src/services/createPriceDisplayValue';
import s from './style.module.less';

interface Props {
  videoItem: Video;
  cartItem: ApiCartItem;
}

const CartItem = ({ videoItem, cartItem }: Props) => {
  const [startAnimation, setStartAnimation] = useState<boolean>(false);
  const [shrinkAnimation, setShrinkAnimation] = useState<boolean>(false);

  const { mutate: mutateDeleteFromCart, error } = useCartMutation();

  const cartItemAnimate = () => {
    setStartAnimation(true);
    setTimeout(() => {
      setShrinkAnimation(true);
    }, 200);

    setTimeout(() => {
      mutateDeleteFromCart(cartItem.id);
    }, 600);
  };

  useEffect(() => {
    if (error) {
      setStartAnimation(false);
      setShrinkAnimation(false);
    }
  }, [error]);

  return (
    <div
      className={c(s.cartItemWrapper, {
        [s.cartAnimationWrapper]: startAnimation,
        [s.shrink]: shrinkAnimation,
      })}
    >
      <VideoPlayer video={videoItem} />

      <div className="flex flex-col w-full ml-3">
        <div className="flex flex-row justify-between">
          <Link
            to={`/videos/${videoItem.id}`}
            className="text-base text-gray-900 hover:text-gray-900"
          >
            {videoItem.title}
          </Link>
          <div
            className="text-gray-900 text-lg font-bold"
            data-qa="price-value"
          >
            {createPriceDisplayValue(
              videoItem?.price?.amount,
              videoItem?.price?.currency,
              navigator.language,
            )}
          </div>
        </div>
        <div className="text-sm text-gray-800 font-normal">{`ID: ${videoItem.id}`}</div>

        <div className={s.textButton}>
          <Button
            onClick={cartItemAnimate}
            text="Remove"
            icon={<RemoveFromCartIcon />}
          />
        </div>

        <AdditionalServices videoItem={videoItem} cartItem={cartItem} />
      </div>
    </div>
  );
};

export default CartItem;
