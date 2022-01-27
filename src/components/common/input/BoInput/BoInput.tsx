import React, { forwardRef, Ref } from 'react';
import c from 'classnames';
import s from './style.module.less';

export interface BoInputProps {
  onChange?: (text: string) => void;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  label: string;
  defaultValue?: string;
  inputType?: string;
  constraints?: BoInputConstraints;
}

interface BoInputConstraints {
  required?: boolean;
  minLength?: number;
}

export const BoInput = forwardRef(
  (
    {
      onChange,
      error = false,
      errorMessage = 'there is an error',
      placeholder = 'placeholder',
      label,
      defaultValue,
      inputType = 'text',
      constraints = {
        required: false,
        minLength: 0,
      },
    }: BoInputProps,
    ref: Ref<HTMLInputElement>,
  ) => (
    <label htmlFor={label} className="mb-6  flex flex-col">
      <span className="flex flex-row">
        {constraints.required && (
          <span className="text-failure-message-border">*</span>
        )}
        {label}
      </span>
      <input
        ref={ref}
        minLength={constraints?.minLength}
        required={constraints?.required}
        placeholder={placeholder}
        type={inputType}
        id={label}
        onChange={(e) => (onChange ? onChange(e.target.value) : {})}
        className={c(s.input, {
          [s.error]: error,
        })}
        defaultValue={defaultValue}
      />
      {error && (
        <h3 className="text-caption text-failure-message-border mt-0.5">
          {errorMessage}
        </h3>
      )}
    </label>
  ),
);
