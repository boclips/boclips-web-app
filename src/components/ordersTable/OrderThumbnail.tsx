import React from 'react';
import { useFindOrGetVideo } from '@src/hooks/api/videoQuery';
import { OrderItem } from 'boclips-api-client/dist/sub-clients/orders/model/OrderItem';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

interface Props {
  items: OrderItem[];
}

export const OrderThumbnail = ({ items }: Props) => {
  const count = items.length;
  const { data: firstVideo } = useFindOrGetVideo(items[0]?.video?.id);

  return (
    <div className="flex flex-grow relative">
      <div
        data-qa="order-item-thumbnail"
        className={s.thumbnail}
        style={{
          backgroundImage: `url(${firstVideo?.playback?.links?.thumbnail?.getOriginalLink()})`,
        }}
      >
        <div className="text-white z-10 relative flex flex-col h-full items-center justify-center">
          <Typography.H1
            data-qa="order-item-count"
            className="tabular-nums -mt-2"
          >
            {count}
          </Typography.H1>
          <Typography.H2 size="sm" className="-mt-2">
            {count > 1 ? 'videos' : 'video'}
          </Typography.H2>
        </div>
      </div>
    </div>
  );
};
