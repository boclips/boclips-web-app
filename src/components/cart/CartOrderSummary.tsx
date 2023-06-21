import React, { ReactElement, useState } from 'react';
import Button from '@boclips-ui/button';
import { getTotalPrice } from 'src/services/getTotalPrice';
import { useCartValidation } from 'src/components/common/providers/CartValidationProvider';
import { OrderModal } from 'src/components/orderModal/OrderModal';
import { Cart as ApiCart } from 'boclips-api-client/dist/sub-clients/carts/model/Cart';
import { useGetVideos } from 'src/hooks/api/videoQuery';
import { Typography } from '@boclips-ui/typography';
import { AdditionalServicesPricingMessage } from 'src/components/cart/AdditionalServices/AdditionalServicesPricingMessage';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { trackOrderConfirmationModalOpened } from '../common/analytics/Analytics';
import { useBoclipsClient } from '../common/providers/BoclipsClientProvider';
import s from './style.module.less';
import { PriceBadge } from 'src/components/common/price/PriceBadge';

interface Props {
  cart: ApiCart;
}

interface CartSummaryItemProps {
  label: string | ReactElement;
  value?: string | ReactElement;
}

const CartSummaryItem = ({ label, value }: CartSummaryItemProps) => {
  return (
    <Typography.Body as="div" className="flex justify-between my-3">
      <span>{label}</span>
      <span>{value}</span>
    </Typography.Body>
  );
};

export const CartOrderSummary = ({ cart }: Props) => {
  const { isCartValid } = useCartValidation();
  const [displayErrorMessage, setDisplayErrorMessage] =
    useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const boclipsClient = useBoclipsClient();
  const { data: videos } = useGetVideos(cart.items.map((it) => it.videoId));

  React.useEffect(() => {
    if (modalOpen) {
      trackOrderConfirmationModalOpened(boclipsClient);
    }
  }, [modalOpen, boclipsClient]);

  React.useEffect(() => {
    if (isCartValid) {
      setDisplayErrorMessage(false);
    }
  }, [isCartValid]);

  const captionsAndTranscriptsRequested = cart.items?.find(
    (item) =>
      item?.additionalServices?.captionsRequested ||
      item?.additionalServices?.transcriptRequested,
  );
  const trimRequested = cart.items?.find(
    (item) => item?.additionalServices?.trim,
  );
  const editingRequested = cart.items?.find(
    (item) => item?.additionalServices?.editRequest,
  );

  const additionalServicesRequested =
    captionsAndTranscriptsRequested || editingRequested || trimRequested;

  return (
    <>
      <div className="col-start-19 col-end-26">
        <div className="flex flex-col rounded p-5 shadow">
          <FeatureGate feature="BO_WEB_APP_PRICES">
            <div className={s.cartInfoWrapper}>
              <CartSummaryItem
                label={<Typography.Body>Video(s) total</Typography.Body>}
                value={<PriceBadge price={getTotalPrice(videos)} />}
              />
              {captionsAndTranscriptsRequested && (
                <CartSummaryItem label="Captions and transcripts" />
              )}
              {editingRequested && <CartSummaryItem label="Editing" />}
              {trimRequested && <CartSummaryItem label="Trimming" />}
            </div>
            <Typography.H1
              size="xs"
              weight="regular"
              className="flex text-gray-900 justify-between mb-6"
            >
              <span>Total</span>
              <span data-qa="total-price">
                <PriceBadge price={getTotalPrice(videos)} />
              </span>
            </Typography.H1>
          </FeatureGate>

          {additionalServicesRequested && <AdditionalServicesPricingMessage />}
          <Button
            onClick={() => {
              setDisplayErrorMessage(!isCartValid);
              setModalOpen(isCartValid);
            }}
            text="Place order"
            height="44px"
            width="100%"
          />
          {displayErrorMessage && (
            <Typography.Body
              as="div"
              size="small"
              className="text-red-error mt-2"
            >
              There are some errors. Please review your shopping cart and
              correct the mistakes.
            </Typography.Body>
          )}
        </div>
      </div>
      {modalOpen && (
        <OrderModal setModalOpen={setModalOpen} videos={videos} cart={cart} />
      )}
    </>
  );
};
