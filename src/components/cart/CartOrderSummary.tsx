import React, { useState } from 'react';
import Button from '@boclips-ui/button';
import { getTotalPrice } from 'src/services/getTotalPrice';
import { useCartValidation } from 'src/components/common/providers/CartValidationProvider';
import { OrderModal } from 'src/components/orderModal/OrderModal';
import { Cart as ApiCart } from 'boclips-api-client/dist/sub-clients/carts/model/Cart';
import { useGetVideos } from 'src/hooks/api/videoQuery';
import { Typography } from '@boclips-ui/typography';
import { AdditionalServicesPricingMessage } from 'src/components/cart/AdditionalServices/AdditionalServicesPricingMessage';
import { CartOrderItemsSummary } from 'src/components/cart/CartOrderItemsSummary';
import { trackOrderConfirmationModalOpened } from '../common/analytics/Analytics';
import { useBoclipsClient } from '../common/providers/BoclipsClientProvider';

interface Props {
  cart: ApiCart;
}

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

  const captionsOrTranscriptsRequested = !!cart.items?.find(
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
    captionsOrTranscriptsRequested || editingRequested || trimRequested;

  return (
    <>
      <div className="col-start-19 col-end-26">
        {additionalServicesRequested && (
          <AdditionalServicesPricingMessage
            captionsOrTranscriptsRequested={captionsOrTranscriptsRequested}
          />
        )}
        <div className="flex flex-col rounded p-5 shadow">
          {getTotalPrice(videos) && <CartOrderItemsSummary cart={cart} />}

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
