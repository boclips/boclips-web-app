import React from 'react';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import { OrderItem } from 'boclips-api-client/dist/sub-clients/orders/model/OrderItem';
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
          <div
            data-qa="order-item-count"
            className="font-bold text-5xl leading-8"
          >
            {count}
          </div>
          <span className="text-xl">{count > 1 ? 'videos' : 'video'}</span>
        </div>
      </div>
    </div>
  );
};
