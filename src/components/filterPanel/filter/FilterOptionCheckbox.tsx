import React from 'react';
import { FilterOption } from 'src/types/FilterOption';
import BoCheckbox from 'src/components/common/input/BoCheckbox';
import { Typography } from '@boclips-ui/typography';
import s from './FilterOptionList.module.less';

interface Props {
  option: FilterOption;
  selected: boolean;
  onSelect: (event, item) => void;
  dataQa?: string;
}
export const FilterOptionCheckbox = ({
  option,
  selected,
  onSelect,
  dataQa,
}: Props) => {
  return (
    <div key={option.id} className={s.checkboxItem}>
      <BoCheckbox
        onChange={(event) => onSelect(event, option.id)}
        name={option.name}
        id={option.id}
        checked={selected}
        dataQa={dataQa}
        label={option.label}
        defaultSize={false}
      />
      <Typography.Body
        size="small"
        data-qa="option-hits"
        className="text-gray-800"
      >
        {option.hits}
      </Typography.Body>
    </div>
  );
};
