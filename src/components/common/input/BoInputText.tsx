import React, { Ref, useEffect, useState } from 'react';
import c from 'classnames';
import ErrorIconSVG from 'resources/icons/error-icon.svg';
import CrossIconSVG from 'resources/icons/cross-icon.svg';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

export interface BoInputProps extends InputProps {
  id: string;
  onChange: (text: string) => void;
  error?: boolean;
  errorMessage?: string;
  icon?: React.ReactElement;
  allowClear?: boolean;
}

interface InputProps {
  showLabelText?: boolean;
  inputType: 'text' | 'textarea';
  placeholder?: string;
  defaultValue?: string;
  height?: string;
  constraints?: BoInputConstraints;
  labelText?: string;
}

interface BoInputConstraints {
  required?: boolean;
  minLength?: number;
}

export const BoInputText = React.forwardRef(
  (
    {
      onChange,
      error = false,
      errorMessage = 'there is an error',
      placeholder = 'Search...',
      id,
      defaultValue = '',
      inputType,
      height,
      constraints = {
        required: false,
        minLength: 0,
      },
      icon,
      showLabelText = true,
      labelText,
      allowClear = false,
    }: BoInputProps,
    ref: React.Ref<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const [value, setValue] = useState<string>(defaultValue);

    useEffect(() => {
      onChange(value);
    }, [value]);

    const renderInput = () => {
      switch (inputType) {
        case 'text':
          return (
            <input
              minLength={constraints?.minLength}
              required={constraints?.required}
              placeholder={placeholder}
              type="text"
              id={id}
              onChange={(e) => (onChange ? setValue(e.target.value) : {})}
              className={c(s.input, {
                [s.error]: error,
                [s.withIcon]: icon,
              })}
              value={value}
              ref={ref as Ref<HTMLInputElement>}
            />
          );
        case 'textarea':
          return (
            <textarea
              minLength={constraints?.minLength}
              required={constraints?.required}
              placeholder={placeholder}
              id={id}
              onChange={(e) => (onChange ? setValue(e.target.value) : {})}
              className={c(s.input, {
                [s.error]: error,
              })}
              value={value}
              ref={ref as Ref<HTMLTextAreaElement>}
            />
          );
        default:
          return null;
      }
    };

    const onClear = () => {
      setValue('');
    };

    return (
      <label htmlFor={id} className={s.wrapper}>
        {showLabelText && (
          <Typography.Body as="div">
            {labelText}{' '}
            {!constraints.required && (
              <span className={s.optional}>(Optional)</span>
            )}
          </Typography.Body>
        )}
        {error && (
          <span className={s.errorMessage}>
            <ErrorIconSVG />
            {errorMessage}
          </span>
        )}
        <div style={{ height }} className={s.inputWrapper}>
          {renderInput()}
          {icon && (
            <div data-qa="search-icon" className={s.icon}>
              {icon}
            </div>
          )}
          {allowClear && defaultValue?.length > 0 && (
            <button
              type="button"
              className={s.clearButton}
              data-qa="clear-icon"
              onClick={onClear}
            >
              <CrossIconSVG />
            </button>
          )}
        </div>
      </label>
    );
  },
);
