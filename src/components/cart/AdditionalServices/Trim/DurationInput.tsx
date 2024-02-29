import React from 'react';
import c from 'classnames';
import { useDebounce } from 'src/hooks/useDebounce';

interface Props {
  label: string;
  id: string;
  ariaLabel: string;
  isValid: boolean;
  value: string;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const BASE_DURATION = '00:00';

export const DurationInput = ({
  label,
  ariaLabel,
  isValid,
  onBlur,
  onFocus,
  onChange,
  id,
  value,
  disabled = false,
}: Props) => {
  const debouncedIsValid = useDebounce(isValid, 100);
  const onKeyPress = (e) => {
    if (e.key !== ':' && Number.isNaN(Number(e.key))) {
      e.preventDefault();
    }
  };

  return (
    <label htmlFor={id}>
      {label}
      <input
        aria-label={ariaLabel}
        className={c(
          'rounded outline-none w-16 h-10 ml-2 mr-6 px-2 text-center text-gray-800',
          {
            'border-blue-300 border-1': debouncedIsValid,
            'border-red-error border-1': !debouncedIsValid,
          },
        )}
        type="text"
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        onFocus={onFocus}
        onChange={onChange}
        placeholder={BASE_DURATION}
        id={id}
        value={value || ''}
        disabled={disabled}
      />
    </label>
  );
};
