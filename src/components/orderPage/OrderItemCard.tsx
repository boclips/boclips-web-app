import { OrderItem } from 'boclips-api-client/dist/sub-clients/orders/model/OrderItem';
import React from 'react';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import { createPriceDisplayValue } from 'src/services/createPriceDisplayValue';
import { AdditionalServicesSummaryPreview } from 'src/components/cart/AdditionalServices/AdditionalServicesSummaryPreview';
import { getBrowserLocale } from 'src/services/getBrowserLocale';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';
import { Link } from '../common/Link';

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
      className={s.orderItemWrapper}
      style={{ minHeight: '156px' }}
    >
      <div className={s.thumbnail}>
        {!isLoading && (
          <div
            data-qa="order-item-thumbnail"
            style={{
              backgroundImage: `url(${thumbnailUrl})`,
            }}
          />
        )}
      </div>

      <div className="flex flex-col w-full relative pl-8">
        <Typography.Title1 className="absolute right-0 text-gray-800">
          {createPriceDisplayValue(
            item?.price?.value,
            item?.price?.currency,
            getBrowserLocale(),
          )}
        </Typography.Title1>

        <div className="flex flex-col mb-4">
          <Link
            to={`/videos/${item.video.id}`}
            state={{ userNavigated: true }}
            className="text-gray-900 hover:text-gray-900"
          >
            <Typography.Title1>{item.video.title}</Typography.Title1>
          </Link>
          <Typography.Body size="small" className="text-gray-700">
            ID: {item.video.id}
          </Typography.Body>
        </div>

        <AdditionalServicesSummaryPreview
          captionsAndTranscriptsRequested={
            item.captionsRequested && item.transcriptRequested
          }
          trim={item.trim}
          editRequest={item.editRequest}
        />
      </div>
    </div>
  );
};
