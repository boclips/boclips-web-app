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
      <Typography.Body as="div" weight="medium">
        Additional services
      </Typography.Body>
      <TrimService videoItem={videoItem} cartItem={cartItem} />

      <AdditionalServiceCheckbox
        cartItem={cartItem}
        type="transcriptRequested"
        label="Request transcripts"
      />

      <AdditionalServiceCheckbox
        cartItem={cartItem}
        type="captionsRequested"
        label="Request English captions"
      />

      <EditRequest cartItem={cartItem} label="Request other type of editing" />
    </>
  );
};

export default AdditionalServices;
