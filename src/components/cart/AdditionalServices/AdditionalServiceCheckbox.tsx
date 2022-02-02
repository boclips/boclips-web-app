import React, { useState } from 'react';
import { useCartItemAdditionalServicesMutation } from 'src/hooks/api/cartQuery';
import { CartItem } from 'boclips-api-client/dist/sub-clients/carts/model/CartItem';
import c from 'classnames';
import { AdditionalServices } from 'boclips-api-client/dist/sub-clients/carts/model/AdditionalServices';

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
    <div className="h-9 flex flex-row w-full items-center justify-between">
      <label className="cursor-pointer font-normal mr-8" htmlFor={id}>
        <input
          onChange={onChangeCheckbox}
          id={id}
          checked={serviceRequested}
          type="checkbox"
          className="form-checkbox checked:bg-blue-800 w-5 h-5 mr-2 hover:border-blue-800 hover:border-solid border-2 cursor-pointer"
        />
        <span
          className={c({
            'font-medium': serviceRequested,
          })}
        >
          {label}
        </span>
      </label>
      {price && (
        <div className="flex h-full items-center text-lg font-normal">
          {price}
        </div>
      )}
    </div>
  );
};

export default AdditionalServicesCheckbox;
