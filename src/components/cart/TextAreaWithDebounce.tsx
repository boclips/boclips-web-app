import React, { useEffect, useState } from 'react';
import { useDebounce } from 'src/hooks/useDebounce';
import { InputText } from '@boclips-ui/input';

interface Props {
  currentValue?: string;
  onUpdate: (note: string) => void;
  placeholder: string;
  isValid?: boolean;
  enableValidation?: (enabled: boolean) => void;
  onUpdateWithoutDebounce?: (note: string) => void;
}

export const TextAreaWithDebounce = ({
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
    <InputText
      id="cart-note"
      onChange={handleOnChange}
      onFocus={() => enableValidation(false)}
      onBlur={() => enableValidation(true)}
      inputType="textarea"
      isError={!isValid}
      placeholder={placeholder}
      constraints={{ required: false, minLength: 0 }}
      defaultValue={value}
      labelText="Note"
    />
  );
};
