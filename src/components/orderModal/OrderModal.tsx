import React from 'react';
import { Video } from 'boclips-api-client/dist/types';
import { CartItemOrderPreview } from 'src/components/cart/CartItemOrderPreview/CartItemOrderPreview';
import { usePlaceOrderQuery } from 'src/hooks/api/orderQuery';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { useNavigate } from 'react-router-dom';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { Cart } from 'boclips-api-client/dist/sub-clients/carts/model/Cart';
import { Typography } from '@boclips-ui/typography';
import { AdditionalServicesPricingMessage } from 'src/components/cart/AdditionalServices/AdditionalServicesPricingMessage';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { PriceBadge } from 'src/components/common/price/PriceBadge';
import { getTotalPrice } from 'src/services/getTotalPrice';
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
  const navigate = useNavigate();
  const boclipsClient = useBoclipsClient();

  const {
    mutate: placeOrder,
    data: orderLocation,
    isSuccess,
    error,
    isLoading,
  } = usePlaceOrderQuery();

  const { data: user, isInitialLoading: isUserLoading } = useGetUserQuery();

  React.useEffect(() => {
    if (isSuccess) {
      navigate('/order-confirmed', {
        state: {
          orderLocation,
        },
      });
    }
  }, [navigate, isSuccess, orderLocation]);

  React.useEffect(() => {
    if (error) {
      navigate('/error', { state: error });
    }
  }, [navigate, error, orderLocation]);

  const handleConfirm = () => {
    trackOrderConfirmed(boclipsClient);
    AnalyticsFactory.appcues().sendEvent(AppcuesEvent.ORDER_CONFIRMED);
    AnalyticsFactory.hotjar().event(HotjarEvents.OrderConfirmed);
    placeOrder({ cart, user });
  };
  const additionalServicesRequested =
    cart.items.filter(
      (item) =>
        item.additionalServices?.transcriptRequested === true ||
        item.additionalServices?.captionsRequested === true ||
        item.additionalServices?.trim !== null ||
        item.additionalServices?.editRequest !== null,
    ).length > 0;

  return (
    <Bodal
      title="Order summary"
      confirmButtonText="Confirm order"
      onConfirm={handleConfirm}
      isLoading={isLoading || !user || isUserLoading}
      onCancel={() => setModalOpen(false)}
      dataQa="order-modal"
      cancelButtonText="Go back to cart"
      smallSize={false}
    >
      <Typography.Body>
        Please confirm you want to place the following order:
      </Typography.Body>
      <div className={s.modalItemsList}>
        <CartItemOrderPreview videos={videos} />
      </div>
      <div>
        <FeatureGate feature="BO_WEB_APP_PRICES">
          <Typography.Title1 as="div" className={s.modalTotalPrice}>
            <div>Total</div>
            <div>
              <PriceBadge price={getTotalPrice(videos)} />
            </div>
          </Typography.Title1>
        </FeatureGate>
        {additionalServicesRequested && <AdditionalServicesPricingMessage />}
      </div>
    </Bodal>
  );
};
