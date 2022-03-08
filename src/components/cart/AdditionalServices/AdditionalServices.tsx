import React from 'react';
import { Video } from 'boclips-api-client/dist/types';

import { CartItem } from 'boclips-api-client/dist/sub-clients/carts/model/CartItem';
import { TrimService } from 'src/components/cart/AdditionalServices/Trim/Trim';
import AdditionalServiceCheckbox from 'src/components/cart/AdditionalServices/AdditionalServiceCheckbox';
import { EditRequest } from 'src/components/cart/AdditionalServices/editRequest/editRequest';
import { Typography } from '@boclips-ui/typography';

interface Props {
  videoItem: Video;
  cartItem: CartItem;
}

const AdditionalServices = ({ videoItem, cartItem }: Props) => {
  return (
    <>
      <Typography.Body as="div" weight="medium" className="text-gray-800">
        Additional services
      </Typography.Body>
      <TrimService videoItem={videoItem} cartItem={cartItem} price="Free" />

      <AdditionalServiceCheckbox
        cartItem={cartItem}
        type="transcriptRequested"
        label="Request transcripts"
        price="Free"
      />

      <AdditionalServiceCheckbox
        cartItem={cartItem}
        type="captionsRequested"
        label="Request English captions"
        price="Free"
      />

      <EditRequest
        cartItem={cartItem}
        label="Request other type of editing"
        price="Free"
      />
    </>
  );
};

export default AdditionalServices;
