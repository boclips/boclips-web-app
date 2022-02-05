import React, { useState } from 'react';
import { useCartItemAdditionalServicesMutation } from 'src/hooks/api/cartQuery';
import { CartItem } from 'boclips-api-client/dist/sub-clients/carts/model/CartItem';
import { AdditionalServices } from 'boclips-api-client/dist/sub-clients/carts/model/AdditionalServices';
import BoCheckbox from 'src/components/common/input/BoCheckbox';

interface Props {
  label: string;
  type: keyof Omit<AdditionalServices, 'trim' | 'editRequest'>;
  cartItem: CartItem;
  price?: string;
}

const AdditionalServicesCheckbox = ({
  label,
  type,
  cartItem,
  price,
}: Props) => {
  const id = cartItem.videoId + type;
  const isChecked = !!cartItem?.additionalServices?.[type];

  const [serviceRequested, setServiceRequested] = useState<boolean>(isChecked);

  const { mutate: mutateAdditionalServices } =
    useCartItemAdditionalServicesMutation();

  const onChangeCheckbox = (e) => {
    setServiceRequested(e.currentTarget.checked);

    mutateAdditionalServices({
      cartItem,
      additionalServices: { [type]: e.currentTarget.checked },
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

      <div className="flex h-full items-center text-md font-normal">
        {price}
      </div>
    </div>
  );
};

export default AdditionalServicesCheckbox;
