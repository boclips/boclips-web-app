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
  label?: React.ReactElement | string;
  errorMessage?: string;
  dataQa?: string;
}

const BoCheckbox = ({
  dataQa,
  onChange,
  name,
  id,
  checked,
  label,
  errorMessage,
}: Props) => {
  return (
    <span className={s.wrapper}>
      {errorMessage && (
        <span className={s.errorMessage}>
          <ErrorIcon />
          <Typography.Body size="small">{errorMessage}</Typography.Body>
        </span>
      )}
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
        <Typography.Body size="small" weight={checked ? 'medium' : null}>
          {label || name}
        </Typography.Body>
      </label>
    </span>
  );
};

export default BoCheckbox;
