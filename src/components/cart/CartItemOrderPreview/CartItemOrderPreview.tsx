import React from 'react';
import { useCartQuery } from 'src/hooks/api/cartQuery';
import { Video } from 'boclips-api-client/dist/types';
import { CartItem } from 'boclips-api-client/dist/sub-clients/carts/model/CartItem';
import { AdditionalServicesSummaryPreview } from 'src/components/cart/AdditionalServices/AdditionalServicesSummaryPreview';
import c from 'classnames';
import { createPriceDisplayValue } from 'src/services/createPriceDisplayValue';
import { getBrowserLocale } from 'src/services/getBrowserLocale';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

interface Props {
  videos: Video[];
}

export const CartItemOrderPreview = ({ videos }: Props) => {
  const { data: cart } = useCartQuery();

  const getAdditionalServicesSummary = (cartItem: CartItem) => {
    const trimLabel =
      cartItem?.additionalServices?.trim?.from &&
      cartItem?.additionalServices?.trim?.to
        ? `${cartItem.additionalServices.trim.from} - ${cartItem.additionalServices.trim.to}`
        : null;

    return (
      <AdditionalServicesSummaryPreview
        captionsRequested={cartItem?.additionalServices?.captionsRequested}
        transcriptRequested={cartItem?.additionalServices?.transcriptRequested}
        trim={trimLabel}
        editRequest={cartItem?.additionalServices?.editRequest}
        fontSize="text-xs"
        displayPrice
      />
    );
  };

  return (
    <div>
      {videos.map((video) => (
        <div
          data-qa="order-summary-item-wrapper"
          key={video.id}
          className={c(
            s.orderSummaryWrapper,
            'flex flex-row py-3 border-b-2 border-blue-300 rounded',
          )}
        >
          <div className={s.imgWrapper}>
            <img
              src={video.playback.links.thumbnail.getOriginalLink()}
              alt={video.title}
            />
          </div>
          <div className="ml-5 w-full">
            <div className="text-gray-900 flex justify-between">
              <Typography.Body size="small" weight="medium">
                {video.title}
              </Typography.Body>
              {video.price && (
                <Typography.Body>
                  {createPriceDisplayValue(
                    video.price.amount,
                    video.price.currency,
                    getBrowserLocale(),
                  )}
                </Typography.Body>
              )}
            </div>
            <Typography.Body
              as="div"
              size="small"
              className="text-gray-800"
              data-qa="order-summary-item-video-id"
            >
              ID: {video.id}
            </Typography.Body>
            {getAdditionalServicesSummary(
              cart?.items?.find((cartItem) => cartItem.videoId === video.id),
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
