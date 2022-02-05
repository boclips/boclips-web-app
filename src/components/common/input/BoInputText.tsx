import React from 'react';
import c from 'classnames';
import s from './style.module.less';

export interface BoInputProps {
  inputType: 'text' | 'textarea';
  label: string;
  onChange?: (text: string) => void;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  defaultValue?: string;
  constraints?: BoInputConstraints;
}

interface BoInputConstraints {
  required?: boolean;
  minLength?: number;
}

export const BoInputText = ({
  onChange,
  error = false,
  errorMessage = 'there is an error',
  placeholder = 'placeholder',
  label,
  defaultValue,
  inputType,
  constraints = {
    required: false,
    minLength: 0,
  },
}: BoInputProps) => {
  const renderInput = () => {
    if (inputType === 'text') {
      return (
        <input
          minLength={constraints?.minLength}
          required={constraints?.required}
          placeholder={placeholder}
          type="text"
          id={label}
          onChange={(e) => (onChange ? onChange(e.target.value) : {})}
          className={c(s.input, {
            [s.error]: error,
          })}
          defaultValue={defaultValue}
        />
      );
    }

    if (inputType === 'textarea') {
      return (
        <textarea
          minLength={constraints?.minLength}
          required={constraints?.required}
          placeholder={placeholder}
          id={label}
          onChange={(e) => (onChange ? onChange(e.target.value) : {})}
          className={c(s.input, {
            [s.error]: error,
          })}
          defaultValue={defaultValue}
        />
      );
    }

    return null;
  };

  return (
    <label htmlFor={label} className={s.inputWrapper}>
      <div>
        {label}{' '}
        {!constraints.required && (
          <span className={s.optional}>(Optional)</span>
        )}
      </div>
      {renderInput()}
      {error && <span className={s.errorMessage}>{errorMessage}</span>}
    </label>
  );
};
