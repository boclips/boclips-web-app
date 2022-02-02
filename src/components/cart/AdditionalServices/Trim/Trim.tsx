import React, { useEffect, useState } from 'react';
import { useCartItemAdditionalServicesMutation } from 'src/hooks/api/cartQuery';
import { AdditionalServices as AdditionalServicesApi } from 'boclips-api-client/dist/sub-clients/carts/model/AdditionalServices';
import { Video } from 'boclips-api-client/dist/types';
import { CartItem } from 'boclips-api-client/dist/sub-clients/carts/model/CartItem';
import c from 'classnames';
import { useCartValidation } from 'src/components/common/providers/CartValidationProvider';
import { useDebounce } from 'src/hooks/useDebounce';
import { DurationInput } from './DurationInput';
import { isTrimFromValid, isTrimToValid } from './trimValidation';

interface Props {
  videoItem: Video;
  cartItem: CartItem;
  price?: string;
}

export const TrimService = ({ videoItem, cartItem, price }: Props) => {
  const { cartItemsValidation, setCartItemsValidation } = useCartValidation();
  const { mutate: mutateAdditionalServices } =
    useCartItemAdditionalServicesMutation();

  const trimSet = !!cartItem?.additionalServices?.trim;
  const [trimChecked, setTrimChecked] = useState(trimSet);
  const [isValidationEnabled, setIsValidationEnabled] = useState(false);

  const [trimValue, setTrimValue] = useState<AdditionalServicesApi>({
    trim: {
      from: cartItem?.additionalServices?.trim?.from,
      to: cartItem?.additionalServices?.trim?.to,
    },
  });

  const cartItemId = cartItem.id;
  const videoDuration = videoItem.playback.duration;
  const trimValidation = cartItemsValidation[cartItem.id]?.trim;
  const isTrimValid = trimValidation?.isFromValid && trimValidation?.isToValid;
  const debouncedIsTrimValid = useDebounce(isTrimValid, 100);

  useEffect(() => {
    setCartItemsValidation((prevState) => {
      return {
        ...prevState,
        [cartItemId]: {
          ...prevState[cartItemId],
          trim: {
            isFromValid:
              !isValidationEnabled ||
              isTrimFromValid(
                {
                  from: trimValue.trim.from,
                  to: trimValue.trim.to,
                },
                videoDuration,
              ),
            isToValid:
              !isValidationEnabled ||
              isTrimToValid(
                {
                  from: trimValue.trim.from,
                  to: trimValue.trim.to,
                },
                videoDuration,
              ),
          },
        },
      };
    });
  }, [
    videoDuration,
    trimValue,
    cartItemId,
    setCartItemsValidation,
    isValidationEnabled,
  ]);

  const onChangeCheckbox = (e) => {
    setTrimChecked(e.currentTarget.checked);

    if (!e.currentTarget.checked) {
      mutateAdditionalServices({
        cartItem,
        additionalServices: { trim: null },
      });

      setTrimValue((prevState) => {
        return {
          ...prevState,
          trim: {
            from: null,
            to: null,
          },
        };
      });

      setIsValidationEnabled(false);
    }
  };

  const onChangeTrimInput = (e, trimCheckpoint) => {
    const trim = e.target.value;

    const value = { [trimCheckpoint]: trim };
    setTrimValue((prevState) => {
      return {
        ...prevState,
        trim: {
          ...prevState.trim,
          ...value,
        },
      };
    });
  };

  const onBlur = () => {
    setIsValidationEnabled(true);
    const isValid =
      isTrimFromValid(
        {
          from: trimValue.trim.from,
          to: trimValue.trim.to,
        },
        videoDuration,
      ) &&
      isTrimToValid(
        {
          from: trimValue.trim.from,
          to: trimValue.trim.to,
        },
        videoDuration,
      );

    if (isValid) {
      mutateAdditionalServices({
        cartItem,
        additionalServices: {
          trim: trimValue.trim,
        },
      });
    }
  };

  return (
    <>
      <div className="h-9 flex flex-row w-full items-center justify-between">
        <label
          className="cursor-pointer font-normal mr-8"
          htmlFor={videoItem.id}
        >
          <input
            onChange={onChangeCheckbox}
            id={videoItem.id}
            checked={trimChecked}
            type="checkbox"
            className="form-checkbox checked:bg-blue-800 w-5 h-5 mr-2 hover:border-blue-800 hover:border-solid border-2 cursor-pointer"
          />
          <span
            className={c({
              'font-medium': trimChecked,
            })}
          >
            Trim video
          </span>
        </label>
        {price && (
          <div className="flex h-full items-center text-lg font-normal">
            {price}
          </div>
        )}
      </div>
      {trimChecked && (
        <div className="ml-7 -mt-1 font-normal">
          <div className="text-xs mb-2">
            Specify how you’d like to trim the video
          </div>
          <div className="text-md h-full flex flex-row font-normal mt-2">
            <DurationInput
              label="From:"
              isValid={trimValidation?.isFromValid}
              ariaLabel="trim-from"
              onBlur={onBlur}
              onFocus={() => setIsValidationEnabled(false)}
              onChange={(e) => onChangeTrimInput(e, 'from')}
              id={`${videoItem.id}-from`}
              value={trimValue.trim.from}
            />
            <DurationInput
              ariaLabel="trim-to"
              isValid={trimValidation?.isToValid}
              label="To:"
              onFocus={() => setIsValidationEnabled(false)}
              onChange={(e) => onChangeTrimInput(e, 'to')}
              onBlur={onBlur}
              id={`${videoItem.id}-to`}
              value={trimValue.trim.to}
            />
          </div>
          {!debouncedIsTrimValid && (
            <div className="text-xs ml-12 text-red-error mt-1">
              &nbsp;Specify your trimming options
            </div>
          )}
        </div>
      )}
    </>
  );
};
