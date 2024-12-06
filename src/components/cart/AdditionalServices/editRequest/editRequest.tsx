import React, { useEffect, useState } from 'react';
import { useCartItemAdditionalServicesMutation } from '@src/hooks/api/cartQuery';
import { CartItem } from 'boclips-api-client/dist/sub-clients/carts/model/CartItem';
import { TextAreaWithDebounce } from '@components/cart/TextAreaWithDebounce';
import { useCartValidation } from '@components/common/providers/CartValidationProvider';
import BoCheckbox from '@components/common/input/BoCheckbox';
import { Typography } from 'boclips-ui';

interface Props {
  label: string;
  cartItem: CartItem;
  price?: string;
}

export const EditRequest = ({ label, cartItem, price }: Props) => {
  const { cartItemsValidation, setCartItemsValidation } = useCartValidation();
  const [isValidationEnabled, setIsValidationEnabled] = useState(false);
  const [editRequestWithoutDebounce, setEditRequestWithoutDebounce] = useState(
    cartItem.additionalServices?.editRequest,
  );
  const isEditRequestValid =
    cartItemsValidation[cartItem.id]?.editRequest?.isValid;

  const cartItemId = cartItem.id;
  const isChecked = !!cartItem?.additionalServices?.editRequest;
  const id = `${cartItem.videoId}editingRequested`;

  const { mutate: mutateAdditionalServices } =
    useCartItemAdditionalServicesMutation();

  const [serviceRequested, setServiceRequested] = useState(isChecked);

  useEffect(() => {
    setCartItemsValidation((prevState) => {
      return {
        ...prevState,
        [cartItemId]: {
          ...prevState[cartItemId],
          editRequest: {
            isValid:
              !isValidationEnabled ||
              (!!editRequestWithoutDebounce &&
                editRequestWithoutDebounce !== ''),
          },
        },
      };
    });
  }, [
    cartItemId,
    setCartItemsValidation,
    isValidationEnabled,
    editRequestWithoutDebounce,
  ]);

  const handleChange = (e) => {
    if (!e.currentTarget.checked) {
      updateEditRequest(null);
      setIsValidationEnabled(false);
    }
    setServiceRequested(e.currentTarget.checked);
  };

  const updateEditRequest = (editRequestValue: string | null) => {
    if (editRequestValue !== '') {
      mutateAdditionalServices({
        cartItem,
        additionalServices: { editRequest: editRequestValue },
      });
    }
  };

  return (
    <>
      <div className="flex flex-row w-full items-center justify-between mb-2">
        <BoCheckbox
          onChange={handleChange}
          name={label}
          id={id}
          checked={serviceRequested}
        />
        {price && (
          <Typography.Body as="div" className="flex h-full items-center">
            {price}
          </Typography.Body>
        )}
      </div>
      {serviceRequested && (
        <div className="ml-7 -mt-1 font-normal">
          <Typography.Body as="div" size="small" className="mb-2">
            Specify how you’d like to edit the video
          </Typography.Body>
          <TextAreaWithDebounce
            currentValue={cartItem.additionalServices?.editRequest}
            enableValidation={(enabled: boolean) =>
              setIsValidationEnabled(enabled)
            }
            onUpdate={updateEditRequest}
            placeholder="eg. Remove front and end credits"
            isValid={isEditRequestValid}
            isRequired
            onUpdateWithoutDebounce={setEditRequestWithoutDebounce}
          />
          {!isEditRequestValid && (
            <Typography.Body
              as="div"
              size="small"
              className="text-red-error mb-2"
            >
              Specify your editing requirements
            </Typography.Body>
          )}
        </div>
      )}
    </>
  );
};
