import React, { ReactElement } from 'react';
import { getTotalPrice } from 'src/services/getTotalPrice';
import { Cart as ApiCart } from 'boclips-api-client/dist/sub-clients/carts/model/Cart';
import { useGetVideos } from 'src/hooks/api/videoQuery';
import { Typography } from '@boclips-ui/typography';
import { AdditionalServicesPricingMessage } from 'src/components/cart/AdditionalServices/AdditionalServicesPricingMessage';
import DisplayPrice from 'src/components/common/price/DisplayPrice';
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

export const CartOrderItemsSummary = ({ cart }: Props) => {
  const { data: videos } = useGetVideos(cart.items.map((it) => it.videoId));

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
      <div className={s.cartInfoWrapper}>
        <CartSummaryItem
          label={<Typography.Body>Video(s) total</Typography.Body>}
          value={<DisplayPrice price={getTotalPrice(videos)} isBold={false} />}
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
          <DisplayPrice price={getTotalPrice(videos)} isBold={false} />
        </span>
      </Typography.H1>
      {additionalServicesRequested && <AdditionalServicesPricingMessage />}
    </>
  );
};
