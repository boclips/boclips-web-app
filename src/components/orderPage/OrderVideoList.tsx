import { OrderItemCard } from 'src/components/orderPage/OrderItemCard';
import React from 'react';
import { Order } from 'boclips-api-client/dist/sub-clients/orders/model/Order';

interface Props {
  order: Order;
  onAssetDownload?: () => void;
}

export const OrderVideoList = ({ order, onAssetDownload }: Props) => {
  return (
    <main tabIndex={-1} className="col-start-2 col-end-26">
      {order?.items.map((orderItem) => (
        <OrderItemCard
          item={orderItem}
          status={order.status}
          onAssetDownload={onAssetDownload}
          key={`id-${orderItem.id}`}
        />
      ))}
    </main>
  );
};
