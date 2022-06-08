import React, { useState } from 'react';
import { useCartItemAdditionalServicesMutation } from 'src/hooks/api/cartQuery';
import { CartItem } from 'boclips-api-client/dist/sub-clients/carts/model/CartItem';
import BoCheckbox from 'src/components/common/input/BoCheckbox';
import { Typography } from '@boclips-ui/typography';

interface Props {
  label: string;
  cartItem: CartItem;
  price?: string;
}

const AdditionalServicesCheckbox = ({ label, cartItem, price }: Props) => {
  const id = `${cartItem.videoId}captionsAndTranscriptRequested`;
  const isChecked =
    !!cartItem?.additionalServices?.captionsRequested &&
    !!cartItem?.additionalServices?.transcriptRequested;

  const [serviceRequested, setServiceRequested] = useState<boolean>(isChecked);

  const { mutate: mutateAdditionalServices } =
    useCartItemAdditionalServicesMutation();

  const onChangeCheckbox = (e) => {
    setServiceRequested(e.currentTarget.checked);

    mutateAdditionalServices({
      cartItem,
      additionalServices: {
        transcriptRequested: e.currentTarget.checked,
        captionsRequested: e.currentTarget.checked,
      },
    });
  };

  return (
    <div className="flex flex-row w-full items-center justify-between mb-2">
      <BoCheckbox
        onChange={onChangeCheckbox}
        name={label}
        id={id}
        checked={serviceRequested}
      />

      <Typography.Body as="div" className="flex h-full items-center">
        {price}
      </Typography.Body>
    </div>
  );
};

export default AdditionalServicesCheckbox;
