import React, { forwardRef, Ref } from 'react';
import c from 'classnames';
import { BoInputProps } from 'src/components/common/input/BoInput/BoInput';
import s from './style.module.less';

export const BoTextArea = forwardRef(
  (
    {
      onChange,
      error = false,
      errorMessage = 'there is an error',
      placeholder = 'placeholder',
      label,
      defaultValue,
      constraints = {
        required: false,
        minLength: 0,
      },
    }: BoInputProps,
    ref: Ref<HTMLTextAreaElement>,
  ) => (
    <label htmlFor={label} className="mb-6  flex flex-col">
      <span className="flex flex-row">
        {constraints.required && (
          <span className="text-failure-message-border">*</span>
        )}
        {label}
      </span>
      <textarea
        ref={ref}
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
      {error && (
        <h3 className="text-caption text-failure-message-border mt-0.5">
          {errorMessage}
        </h3>
      )}
    </label>
  ),
);
