import { OrderItemCard } from 'src/components/orderPage/OrderItemCard';
import React from 'react';
import { Order } from 'boclips-api-client/dist/sub-clients/orders/model/Order';
import { useGetVideos } from 'src/hooks/api/videoQuery';

interface Props {
  order: Order;
}

export const OrderVideoList = ({ order }: Props) => {
  const { data: videos } = useGetVideos(
    order?.items.map((item) => item.video.id) ?? [],
  );

  return (
    <main tabIndex={-1} className="col-start-2 col-end-26">
      {order?.items.map((orderItem) => (
        <OrderItemCard
          item={orderItem}
          key={`id-${orderItem.id}`}
          video={videos?.find((video) => video.id === orderItem.video.id)}
        />
      ))}
    </main>
  );
};
