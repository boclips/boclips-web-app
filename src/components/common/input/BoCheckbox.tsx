import React, { ChangeEvent } from 'react';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

interface Props {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  id: string;
  checked: boolean;
  label?: React.ReactElement | string;
  dataQa?: string;
  defaultSize?: boolean;
}

const BoCheckbox = ({
  dataQa,
  onChange,
  name,
  id,
  checked,
  label,
  defaultSize = true,
}: Props) => {
  return (
    <label className={s.checkboxWrapper} htmlFor={id}>
      <input
        onChange={onChange}
        type="checkbox"
        className={s.checkbox}
        name={name}
        id={id}
        checked={checked}
        data-qa={dataQa}
      />
      <Typography.Body
        size={defaultSize ? null : 'small'}
        weight={checked ? 'medium' : null}
      >
        {label || name}
      </Typography.Body>
    </label>
  );
};

export default BoCheckbox;
