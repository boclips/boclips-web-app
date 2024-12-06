import React, { useEffect, useRef } from 'react';
import { Input } from 'boclips-ui';
import s from './style.module.less';

interface Props {
  label: string;
  id: string;
  isError?: boolean;
  onBlur?: () => void;
  onChange: (value: string) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
}

export const BASE_DURATION = '00:00';

export const DurationInput = ({
  label,
  isError,
  onBlur,
  onFocus,
  onChange,
  id,
  value,
  disabled = false,
  placeholder = BASE_DURATION,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onKeyPress = (e) => {
    if (
      e.key !== ':' &&
      Number.isNaN(Number(e.key)) &&
      e.key !== 'Backspace' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowRight' &&
      e.key !== 'Delete'
    ) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (disabled) {
      inputRef.current.setAttribute('disabled', 'true');
    } else {
      inputRef.current.removeAttribute('disabled');
    }
  }, [disabled]);

  return (
    <div className={s.durationInput}>
      <Input
        ref={inputRef}
        labelText={label}
        showLabelText
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        onChange={onChange}
        inputType="text"
        width="72px"
        onKeyDown={onKeyPress}
        constraints={{
          maxLength: 5,
        }}
        isError={isError}
        onBlur={onBlur}
        // @ts-ignore
        onFocus={onFocus}
      />
    </div>
  );
};
