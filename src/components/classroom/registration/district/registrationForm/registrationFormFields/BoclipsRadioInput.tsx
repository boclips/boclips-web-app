import React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

export interface Props {
  id: string;
  label: string;
  defaultValue?: string;
  items: { value: string; label: string }[];
  onValueChange: (value: string) => void;
}

const BoclipsRadioInput = ({ id, label, defaultValue, items, onValueChange }: Props) => {

  const defaultValueAsString =
    defaultValue === undefined ? undefined : defaultValue ? 'yes' : 'no';


  const getRadioItems(items) => {
    items.map((item) => {
      <div className={s.radioGroupItemWrapper}>
        <RadioGroup.Item
          className={s.radioGroupItem}
          value={item.value}
          id={'${id}-${item.value}'}
          aria-label={`${label} ${item.label}`}
        >
          <RadioGroup.Indicator className={s.radioGroupIndicator} />
        </RadioGroup.Item>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor={'${id}-${item.value}'}>
          <Typography.Body as="span" className={s.radioItemLabel}>
            {item.label}
          </Typography.Body>
        </label>
      </div>
  }
  }

  return (
    <div className={s.wrapper}>
      <Typography.Body className={s.label} as="span">
        {label}
      </Typography.Body>
      <RadioGroup.Root
        className={s.radioGroupRoot}
        orientation="horizontal"
        onValueChange={onValueChange}
        defaultValue={defaultValueAsString}
      >

      </RadioGroup.Root>
    </div>
  );
};

export default YesNo;
