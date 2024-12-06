import React, { ChangeEvent } from 'react';
import { Typography } from 'boclips-ui';
import ErrorIcon from '@resources/icons/error-icon.svg?react';
import c from 'classnames';
import s from './style.module.less';

interface Props {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  name: string;
  id: string;
  checked: boolean;
  errorMessage?: string;
  dataQa?: string;
  label: React.ReactElement;
}

const RegistrationPageCheckbox = ({
  dataQa,
  onChange,
  onFocus,
  name,
  id,
  checked,
  errorMessage,
  label,
}: Props) => {
  return (
    <span className={c('mb-4', s.wrapper)}>
      <label className={s.checkboxWrapper} htmlFor={id}>
        <input
          onChange={onChange}
          onFocus={() => {
            if (onFocus) onFocus();
          }}
          type="checkbox"
          className={c(s.checkbox, { [s.error]: errorMessage })}
          name={name}
          id={id}
          checked={checked}
          data-qa={dataQa}
        />
        <div className={s.checkboxCopy}>{label}</div>
      </label>
      {errorMessage && (
        <span className={s.errorMessage}>
          <ErrorIcon />
          <Typography.Body size="small">{errorMessage}</Typography.Body>
        </span>
      )}
    </span>
  );
};

export default RegistrationPageCheckbox;
