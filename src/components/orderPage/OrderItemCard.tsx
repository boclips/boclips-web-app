import { OrderItem } from 'boclips-api-client/dist/sub-clients/orders/model/OrderItem';
import React from 'react';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import { AdditionalServicesSummaryPreview } from 'src/components/cart/AdditionalServices/AdditionalServicesSummaryPreview';
import { Typography } from '@boclips-ui/typography';
import { PriceBadge } from 'src/components/common/price/PriceBadge';
import s from './style.module.less';
import { Link } from '../common/Link';

interface Props {
  item: OrderItem;
}

export const OrderItemCard = ({ item }: Props) => {
  const { data: video } = useFindOrGetVideo(item.video.id);

  return (
    <div
      data-qa="order-item-card"
      className={s.orderItemWrapper}
      style={{ minHeight: '156px' }}
    >
      <div
        className={s.thumbnail}
        data-qa="order-item-thumbnail"
        style={{
          backgroundImage: `url(${video?.playback?.links?.thumbnail?.getOriginalLink()})`,
        }}
      />

      <div className="flex flex-col w-full relative pl-8">
        <Typography.Title1 className="absolute right-0 text-gray-800">
          {item?.price && (
            <PriceBadge
              price={{
                amount: item.price.value,
                currency: item.price.currency,
              }}
            />
          )}
        </Typography.Title1>

        <div className="flex flex-col mb-4">
          {video ? (
            <Link
              to={`/videos/${item.video.id}`}
              state={{ userNavigated: true }}
              className="text-gray-900 hover:text-gray-900"
            >
              <Typography.Title1>{item.video.title}</Typography.Title1>
            </Link>
          ) : (
            <Typography.Title1>{item.video.title}</Typography.Title1>
          )}
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
