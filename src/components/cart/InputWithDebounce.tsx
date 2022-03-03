import React, { useEffect, useState } from 'react';
import { useDebounce } from 'src/hooks/useDebounce';
import c from 'classnames';

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
    setValue(e.target.value);
    onUpdateWithoutDebounce(e.target.value);
  };

  useEffect(() => {
    if (debouncedValue || debouncedValue === '') {
      onUpdate(debouncedValue);
    }
    // eslint-disable-next-line
  }, [debouncedValue]);

  return (
    <textarea
      className={c(
        'rounded border-gray-500 w-full border-2 placeholder-gray-600 text-gray-900 p-3 bg-scroll resize-none',
        {
          'border-red-error focus:outline-none': !isValid,
        },
      )}
      placeholder={placeholder}
      onChange={handleOnChange}
      onFocus={() => enableValidation(false)}
      onBlur={() => enableValidation(true)}
      value={value}
      rows={2}
    />
  );
};
