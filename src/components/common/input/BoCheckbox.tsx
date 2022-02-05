import React, { ChangeEvent } from 'react';
import c from 'classnames';
import s from './style.module.less';

interface Props {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  id: string;
  checked: boolean;
  label?: React.ReactElement | string;
  dataQa?: string;
}

const BoCheckbox = ({ dataQa, onChange, name, id, checked, label }: Props) => {
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
      <span className={c({ 'font-medium': checked })}>{label || name}</span>
    </label>
  );
};

export default BoCheckbox;
