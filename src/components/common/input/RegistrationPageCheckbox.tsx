import React, { ChangeEvent } from 'react';
import { Typography } from '@boclips-ui/typography';
import ErrorIcon from 'src/resources/icons/error-icon.svg';
import c from 'classnames';
import s from './style.module.less';

interface Props {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  id: string;
  checked: boolean;
  errorMessage?: string;
  dataQa?: string;
}

const RegistrationPageCheckbox = ({
  dataQa,
  onChange,
  name,
  id,
  checked,
  errorMessage,
}: Props) => {
  return (
    <span className={s.wrapper}>
      <label className={s.checkboxWrapper} htmlFor={id}>
        <input
          onChange={onChange}
          type="checkbox"
          className={c(s.checkbox, { [s.error]: errorMessage })}
          name={name}
          id={id}
          checked={checked}
          data-qa={dataQa}
        />
        <div className={s.checkboxCopy}>
          <Typography.Body size="small" weight="medium">
            I certify that I am accessing this service solely for Educational
            Use.
          </Typography.Body>
          <Typography.Body size="small" className={s.checkboxCopyColor}>
            {`"Educational Use" is defined as to copy, communicate, edit, and/or
          incorporate into a publication or digital product for a learning
          outcome.`}
          </Typography.Body>
        </div>
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
