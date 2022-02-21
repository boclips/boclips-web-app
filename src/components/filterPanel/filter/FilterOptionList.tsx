import React, { useState } from 'react';
import c from 'classnames';
import { FilterOption } from 'src/types/FilterOption';
import { FilterOptionCheckbox } from 'src/components/filterPanel/filter/FilterOptionCheckbox';
import { handleEnterKeyEvent } from 'src/services/handleKeyEvent';
import s from './FilterOptionList.module.less';

interface Props {
  options: FilterOption[];
  onSelect: (event, item) => void;
  selectedOptions: string[];
}

const DEFAULT_VISIBLE_OPTIONS = 5;

export const FilterOptionList = ({
  options,
  onSelect,
  selectedOptions,
}: Props) => {
  const [allExpanded, setAllExpanded] = useState<boolean>(false);

  const toggleOptions = () => setAllExpanded(!allExpanded);

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
  const tooManyOptions = optionsWithHits.length > DEFAULT_VISIBLE_OPTIONS;
  const optionsWithSelectedOnesFirst =
    divideOptionsByBeingSelected(optionsWithHits);

  return (
    <div className="flex flex-col mb-1">
      <div
        data-qa="filter-option-list"
        className={c(s.filterOptions, {
          [s.opened]: allExpanded && tooManyOptions,
        })}
      >
        {optionsWithSelectedOnesFirst
          .slice(
            0,
            allExpanded
              ? optionsWithSelectedOnesFirst.length
              : DEFAULT_VISIBLE_OPTIONS,
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
        <button
          type="button"
          onClick={() => setAllExpanded(!allExpanded)}
          onKeyPress={(event) => handleEnterKeyEvent(event, toggleOptions)}
          className={s.showMoreButton}
        >
          {allExpanded
            ? 'Show less'
            : `Show all (${optionsWithSelectedOnesFirst.length})`}
        </button>
      )}
    </div>
  );
};
