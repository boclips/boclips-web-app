import { OrderItem } from 'boclips-api-client/dist/sub-clients/orders/model/OrderItem';
import React from 'react';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import { createPriceDisplayValue } from 'src/services/createPriceDisplayValue';
import { AdditionalServicesSummaryPreview } from 'src/components/cart/AdditionalServices/AdditionalServicesSummaryPreview';
import { Link } from 'react-router-dom';
import { getBrowserLocale } from 'src/services/getBrowserLocale';
import s from './style.module.less';

interface Props {
  item: OrderItem;
}

export const OrderItemCard = ({ item }: Props) => {
  const { data: video, isLoading } = useFindOrGetVideo(item.video.id);

  const thumbnailUrl = isLoading
    ? ''
    : video.playback?.links?.thumbnail.getOriginalLink();

  return (
    <div
      data-qa="order-item-card"
      className="flex flex-row border-b-2 border-blue-300 first:pt-0 py-4"
      style={{ minHeight: '156px' }}
    >
      <div
        data-qa="order-item-thumbnail"
        className={s.thumbnail}
        style={{
          backgroundImage: `url(${thumbnailUrl})`,
        }}
      />
      <div className="flex flex-col w-full relative pl-8">
        <span className="text-base absolute right-0">
          {createPriceDisplayValue(
            item?.price?.value,
            item?.price?.currency,
            getBrowserLocale(),
          )}
        </span>

        <div className="flex flex-col">
          <Link
            to={`/videos/${item.video.id}`}
            className="font-medium text-base text-gray-900 hover:text-gray-900"
          >
            {item.video.title}
          </Link>
          <span>ID: {item.video.id}</span>
        </div>

        <AdditionalServicesSummaryPreview
          captionsRequested={item.captionsRequested}
          transcriptRequested={item.transcriptRequested}
          trim={item.trim}
          editRequest={item.editRequest}
          displayPrice
        />
      </div>
    </div>
  );
};
