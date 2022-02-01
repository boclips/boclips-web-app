import React, { ReactElement, useState } from 'react';
import Button from '@boclips-ui/button';
import { getTotalPriceDisplayValue } from 'src/services/getTotalPriceDisplayValue';
import { useCartValidation } from 'src/components/common/providers/CartValidationProvider';
import { OrderModal } from 'src/components/orderModal/OrderModal';
import { Cart as ApiCart } from 'boclips-api-client/dist/sub-clients/carts/model/Cart';
import { useGetVideos } from 'src/hooks/api/videoQuery';
import { trackOrderConfirmationModalOpened } from '../common/analytics/Analytics';
import { useBoclipsClient } from '../common/providers/BoclipsClientProvider';

interface Props {
  cart: ApiCart;
}

interface CartSummaryItem {
  label: string | ReactElement;
  value: string | ReactElement;
}

export const CartOrderSummary = ({ cart }: Props) => {
  const { isCartValid } = useCartValidation();
  const [displayErrorMessage, setDisplayErrorMessage] = useState<boolean>(
    false,
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const boclipsClient = useBoclipsClient();
  const { data: videos } = useGetVideos(cart.items.map((it) => it.videoId));

  React.useEffect(() => {
    if (modalOpen) {
      trackOrderConfirmationModalOpened(boclipsClient);
    }
  }, [modalOpen, boclipsClient]);

  const CartSummaryItem = ({ label, value }: CartSummaryItem) => {
    return (
      <div className="flex justify-between my-3">
        <span>{label}</span>
        <span>{value}</span>
      </div>
    );
  };

  React.useEffect(() => {
    if (isCartValid) {
      setDisplayErrorMessage(false);
    }
  }, [isCartValid]);

  const transcriptsRequested = cart.items?.find(
    (item) => item?.additionalServices?.transcriptRequested,
  );
  const captionsRequested = cart.items?.find(
    (item) => item?.additionalServices?.captionsRequested,
  );
  const trimRequested = cart.items?.find(
    (item) => item?.additionalServices?.trim,
  );
  const editingRequested = cart.items?.find(
    (item) => item?.additionalServices?.editRequest,
  );

  return (
    <>
      <div className="col-start-19 col-end-26">
        <div className="border-blue-500 border-2 flex flex-col rounded p-5">
          <div className="border-b border-blue-500 mb-4 font-normal text-base">
            <CartSummaryItem
              label={
                <div>
                  Vide
                  <span className="tracking-tightestest">o(s)</span> total
                </div>
              }
              value={getTotalPriceDisplayValue(videos)}
            />
            {captionsRequested && (
              <CartSummaryItem label="Captions" value="Free" />
            )}
            {editingRequested && (
              <CartSummaryItem label="Editing" value="Free" />
            )}
            {transcriptsRequested && (
              <CartSummaryItem label="Transcripts" value="Free" />
            )}
            {trimRequested && <CartSummaryItem label="Trimming" value="Free" />}
          </div>
          <div className="flex font-bold text-lg text-gray-900 justify-between mb-6">
            <span>Total</span>
            <span data-qa="total-price">
              {`${getTotalPriceDisplayValue(videos)}`}
            </span>
          </div>
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
            <div className="text-red-error text-xs mt-2">
              There are some errors. Please review your shopping cart and
              correct the mistakes.
            </div>
          )}
        </div>
      </div>
      {modalOpen && (
        <OrderModal setModalOpen={setModalOpen} videos={videos} cart={cart} />
      )}
    </>
  );
};
