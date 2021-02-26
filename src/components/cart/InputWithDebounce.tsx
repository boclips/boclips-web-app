import React, { useEffect, useState } from 'react';
import { useDebounce } from 'src/hooks/useDebounce';
import c from 'classnames';

interface Props {
  currentValue?: string;
  onUpdate: (note: string) => void;
  placeholder: string;
  isValid?: boolean;
  onFocus?: () => void;
  onUpdateWithoutDebounce?: (note: string) => void;
}
export const InputWithDebounce = ({
  currentValue,
  onUpdate,
  placeholder,
  isValid = true,
  onFocus = () => {},
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
        'rounded w-full placeholder-gray-600 text-gray-900 h-52 p-3 bg-scroll resize-none',
        {
          'border-2 border-blue-300': isValid,
          'border-red-error border-1 focus:outline-none': !isValid,
        },
      )}
      placeholder={placeholder}
      onChange={handleOnChange}
      onFocus={onFocus}
      value={value}
      rows={2}
    />
  );
};
