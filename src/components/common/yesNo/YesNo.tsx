import React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Typography } from 'boclips-ui';
import s from './style.module.less';

export interface Props {
  id: string;
  label: string;
  defaultValue?: boolean;
  onValueChange: (value: boolean) => void;
}

const YesNo = ({ id, label, defaultValue, onValueChange }: Props) => {
  const stringToBooleanValueChangeHandler = (stringValue: string) => {
    if (stringValue === 'yes') {
      onValueChange(true);
    } else if (stringValue === 'no') {
      onValueChange(false);
    }
  };

  const yesId = `${id}-yes`;
  const noId = `${id}-no`;

  const defaultValueAsString =
    defaultValue === undefined ? undefined : defaultValue ? 'yes' : 'no';

  return (
    <div className={s.wrapper}>
      <Typography.Body className={s.label} as="span">
        {label}
      </Typography.Body>
      <RadioGroup.Root
        className={s.radioGroupRoot}
        orientation="horizontal"
        onValueChange={stringToBooleanValueChangeHandler}
        defaultValue={defaultValueAsString}
      >
        <div className={s.radioGroupItemWrapper}>
          <RadioGroup.Item
            className={s.radioGroupItem}
            value="yes"
            id={yesId}
            aria-label={`${label} Yes`}
          >
            <RadioGroup.Indicator className={s.radioGroupIndicator} />
          </RadioGroup.Item>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor={yesId}>
            <Typography.Body as="span" className={s.radioItemLabel}>
              Yes
            </Typography.Body>
          </label>
        </div>
        <div className={s.radioGroupItemWrapper}>
          <RadioGroup.Item
            className={s.radioGroupItem}
            value="no"
            id={noId}
            aria-label={`${label} No`}
          >
            <RadioGroup.Indicator className={s.radioGroupIndicator} />
          </RadioGroup.Item>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor={noId}>
            <Typography.Body as="span" className={s.radioItemLabel}>
              No
            </Typography.Body>
          </label>
        </div>
      </RadioGroup.Root>
    </div>
  );
};

export default YesNo;
