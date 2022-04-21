import React, { ReactElement, useState } from 'react';
import Button from '@boclips-ui/button';
import { getTotalPriceDisplayValue } from 'src/services/getTotalPriceDisplayValue';
import { useCartValidation } from 'src/components/common/providers/CartValidationProvider';
import { OrderModal } from 'src/components/orderModal/OrderModal';
import { Cart as ApiCart } from 'boclips-api-client/dist/sub-clients/carts/model/Cart';
import { useGetVideos } from 'src/hooks/api/videoQuery';
import { Typography } from '@boclips-ui/typography';
import { trackOrderConfirmationModalOpened } from '../common/analytics/Analytics';
import { useBoclipsClient } from '../common/providers/BoclipsClientProvider';
import s from './style.module.less';

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
        <div className="flex flex-col rounded p-5 shadow">
          <div className={s.cartInfoWrapper}>
            <CartSummaryItem
              label={<Typography.Body>Video(s) total</Typography.Body>}
              value={getTotalPriceDisplayValue(videos)}
            />
            {captionsRequested && <CartSummaryItem label="Captions" />}
            {editingRequested && <CartSummaryItem label="Editing" />}
            {transcriptsRequested && <CartSummaryItem label="Transcripts" />}
            {trimRequested && <CartSummaryItem label="Trimming" />}
          </div>
          <Typography.H1
            size="xs"
            weight="regular"
            className="flex text-gray-900 justify-between mb-6"
          >
            <span>Total</span>
            <span data-qa="total-price">
              {`${getTotalPriceDisplayValue(videos)}`}
            </span>
          </Typography.H1>
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
