import React, { useEffect, useState } from 'react';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import AdditionalServices from 'src/components/cart/AdditionalServices/AdditionalServices';
import { CartItem as ApiCartItem } from 'boclips-api-client/dist/sub-clients/carts/model/CartItem';
import RemoveFromCartIcon from 'src/resources/icons/bin.svg';
import { useCartMutation } from 'src/hooks/api/cartQuery';
import c from 'classnames';
import { TextButton } from 'src/components/common/textButton/TextButton';
import { PriceBadge } from 'src/components/common/price/PriceBadge';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import VideoCardPlaceholder from '@boclips-ui/video-card-placeholder';
import { Typography } from '@boclips-ui/typography';
import { VideoInfo } from 'src/components/common/videoInfo/VideoInfo';
import { Link } from 'src/components/common/Link';
import { HotjarEvents } from 'src/services/hotjar/Events';
import HotjarFactory from 'src/services/hotjar/HotjarFactory';
import s from './style.module.less';

interface Props {
  cartItem: ApiCartItem;
}

const CartItem = ({ cartItem }: Props) => {
  const [startAnimation, setStartAnimation] = useState<boolean>(false);
  const [shrinkAnimation, setShrinkAnimation] = useState<boolean>(false);

  const { data: videoItem } = useFindOrGetVideo(cartItem.videoId);

  const { mutate: mutateDeleteFromCart, error } = useCartMutation();

  const videoRemovedHotjarEvent = () => {
    HotjarFactory.hotjar().event(HotjarEvents.VideoRemovedFromCart);
  };

  const cartItemAnimate = () => {
    setStartAnimation(true);

    setTimeout(() => {
      setShrinkAnimation(true);
    }, 200);

    setTimeout(() => {
      mutateDeleteFromCart(cartItem.id);
    }, 600);

    setTimeout(() => {
      videoRemovedHotjarEvent();
    }, 800);
  };

  useEffect(() => {
    if (error) {
      setStartAnimation(false);
      setShrinkAnimation(false);
    }
  }, [error]);

  if (videoItem) {
    return (
      <div
        data-qa="cart-item-wrapper"
        className={c(s.cartItemWrapper, {
          [s.cartAnimationWrapper]: startAnimation,
          [s.shrink]: shrinkAnimation,
        })}
      >
        <div className={s.videoWrapper}>
          <VideoPlayer video={videoItem} controls="cart" showDurationBadge />
        </div>
        <div className="flex flex-col w-full ml-3">
          <div className="flex flex-row justify-between">
            <Link to={`/videos/${videoItem.id}`}>
              <Typography.Title1> {videoItem.title}</Typography.Title1>
            </Link>
            <PriceBadge className="text-gray-900" price={videoItem.price} />
          </div>
          <VideoInfo video={videoItem} />
          <AdditionalServices videoItem={videoItem} cartItem={cartItem} />
          <TextButton
            onClick={cartItemAnimate}
            text="Remove"
            icon={<RemoveFromCartIcon />}
          />
        </div>
      </div>
    );
  }
  return (
    <VideoCardPlaceholder
      displayHeader={false}
      key={`placeholder-${cartItem.id}`}
    />
  );
};

export default CartItem;
