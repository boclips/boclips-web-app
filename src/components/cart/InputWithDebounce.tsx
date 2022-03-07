import React, { useEffect, useState } from 'react';
import { useDebounce } from 'src/hooks/useDebounce';
import { BoInputText } from 'src/components/common/input/BoInputText';

interface Props {
  currentValue?: string;
  onUpdate: (note: string) => void;
  placeholder: string;
  isValid?: boolean;
  enableValidation?: (enabled: boolean) => void;
  onUpdateWithoutDebounce?: (note: string) => void;
}

export const InputWithDebounce = ({
  currentValue,
  onUpdate,
  placeholder,
  isValid = true,
  enableValidation = () => {},
  onUpdateWithoutDebounce = (_) => {},
}: Props) => {
  const [value, setValue] = useState(currentValue || '');
  const debouncedValue = useDebounce(value, 1000);

  const handleOnChange = (e: any) => {
    setValue(e);
    onUpdateWithoutDebounce(e);
  };

  useEffect(() => {
    if (debouncedValue || debouncedValue === '') {
      onUpdate(debouncedValue);
    }
    // eslint-disable-next-line
    }, [debouncedValue]);

  return (
    <BoInputText
      id="cart-note"
      onChange={handleOnChange}
      onFocus={() => enableValidation(false)}
      onBlur={() => enableValidation(true)}
      inputType="textarea"
      isError={!isValid}
      placeholder={placeholder}
      showLabelText={false}
      defaultValue={value}
    />
  );
};
