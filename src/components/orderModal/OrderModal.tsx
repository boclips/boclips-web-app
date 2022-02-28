import React from 'react';
import { Video } from 'boclips-api-client/dist/types';
import { CartItemOrderPreview } from 'src/components/cart/CartItemOrderPreview/CartItemOrderPreview';
import { usePlaceOrderQuery } from 'src/hooks/api/orderQuery';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { useHistory } from 'react-router-dom';
import { getTotalPriceDisplayValue } from 'src/services/getTotalPriceDisplayValue';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { Cart } from 'boclips-api-client/dist/sub-clients/carts/model/Cart';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';
import { trackOrderConfirmed } from '../common/analytics/Analytics';
import { useBoclipsClient } from '../common/providers/BoclipsClientProvider';
import { Bodal } from '../common/bodal/Bodal';

export interface Props {
  setModalOpen: (boolean) => void;
  videos: Video[];
  cart: Cart;
}

export const OrderModal = ({ setModalOpen, videos, cart }: Props) => {
  const history = useHistory();
  const boclipsClient = useBoclipsClient();

  const {
    mutate: placeOrder,
    data: orderLocation,
    isSuccess,
    error,
    isLoading,
  } = usePlaceOrderQuery();

  const { data: user, isLoading: isUserLoading } = useGetUserQuery();

  React.useEffect(() => {
    if (isSuccess) {
      history.push({ pathname: '/order-confirmed' }, { orderLocation });
    }
  }, [history, isSuccess, orderLocation]);

  React.useEffect(() => {
    if (error) {
      history.push({ pathname: '/error' }, { error });
    }
  }, [history, error, orderLocation]);

  const handleConfirm = () => {
    trackOrderConfirmed(boclipsClient);
    AnalyticsFactory.getAppcues().sendEvent(AppcuesEvent.ORDER_CONFIRMED);
    placeOrder({ cart, user });
  };
  return (
    <Bodal
      title="Order summary"
      confirmButtonText="Confirm order"
      onConfirm={handleConfirm}
      isLoading={isUserLoading || !user || isLoading}
      onCancel={() => setModalOpen(false)}
      dataQa="order-modal"
      cancelButtonText="Go back to cart"
    >
      <Typography.Body>
        Please confirm you want to place the following order:
      </Typography.Body>
      <div className={s.modalItemsList}>
        <CartItemOrderPreview videos={videos} />
      </div>
      <div>
        <Typography.Title1 as="div" className={s.modalTotalPrice}>
          <div>Total</div>
          <div>{getTotalPriceDisplayValue(videos)}</div>
        </Typography.Title1>
      </div>
    </Bodal>
  );
};
