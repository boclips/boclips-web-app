import React, { useState } from 'react';
import c from 'classnames';
import { FilterOption } from '@src/types/FilterOption';
import { FilterOptionCheckbox } from '@src/components/filterPanel/filter/FilterOptionCheckbox';
import { TextButton } from '@src/components/common/textButton/TextButton';
import s from './FilterOptionList.module.less';

interface Props {
  options: FilterOption[];
  onSelect: (event, item) => void;
  selectedOptions: string[];
  hierarchical?: boolean;
  showAll?: boolean;
}

const DEFAULT_VISIBLE_OPTIONS = 5;

export const FilterOptionList = ({
  options,
  onSelect,
  selectedOptions,
  hierarchical = false,
  showAll = false,
}: Props) => {
  const [allExpanded, setAllExpanded] = useState<boolean>(false);
  const optionsToShow = showAll ? options.length : DEFAULT_VISIBLE_OPTIONS;

  const divideOptionsByBeingSelected = (
    toDivide: FilterOption[],
  ): FilterOption[] => {
    const divided = toDivide.reduce(
      (acc: [FilterOption[], FilterOption[]], option: FilterOption) => {
        if (selectedOptions.includes(option.id)) {
          acc[0].push(option);
        } else {
          acc[1].push(option);
        }
        return acc;
      },
      [[], []],
    );
    return divided[0].concat(divided[1]);
  };

  const optionsWithHits = options.filter((option) => option.hits > 0);
  const tooManyOptions = optionsWithHits.length > optionsToShow;
  const optionsWithSelectedOnesFirst =
    divideOptionsByBeingSelected(optionsWithHits);

  return (
    <div className="flex flex-col mb-1">
      <div
        data-qa="filter-option-list"
        className={c(s.filterOptions, {
          [s.opened]: allExpanded && tooManyOptions,
          [s.hierarchical]: hierarchical,
        })}
      >
        {optionsWithSelectedOnesFirst
          .slice(
            0,
            allExpanded ? optionsWithSelectedOnesFirst.length : optionsToShow,
          )
          .map((option) => (
            <FilterOptionCheckbox
              key={option.id}
              dataQa={`${option.id}-checkbox`}
              option={option}
              selected={selectedOptions.includes(option.id)}
              onSelect={onSelect}
            />
          ))}
      </div>
      {tooManyOptions && (
        <TextButton
          className={s.showMoreButton}
          onClick={() => setAllExpanded(!allExpanded)}
          text={
            allExpanded
              ? 'Show less'
              : `Show all (${optionsWithSelectedOnesFirst.length})`
          }
        />
      )}
    </div>
  );
};
