import { Typography } from '@boclips-ui/typography';
import React, { useState } from 'react';
import { FilterOptionList } from 'src/components/filterPanel/filter/FilterOptionList';
import { useSearchQueryLocationParams } from 'src/hooks/useLocationParams';
import { FilterOption } from 'src/types/FilterOption';
import FilterArrow from 'src/resources/icons/blue-arrow.svg';
import { CollapsableFilter } from './CollapsableFilter';

interface Props {
  title: string;
  options: HierarchicalFilterOption[];
  filterName: string;
  handleChange: (filter: string, values: string[]) => void;
  filtersSearch?: React.ReactNode;
  handleFilterToggle?: (isOpen: boolean) => void;
  showExplanation?: boolean;
}

export interface HierarchicalFilterOption {
  name: string;
  id: string;
  children: FilterOption[];
}

export const DisciplinesWithSubjectsCheckboxFilter = ({
  title,
  options = [],
  filterName,
  handleChange,
  filtersSearch,
  handleFilterToggle,
  showExplanation,
}: Props) => {
  const [searchLocation] = useSearchQueryLocationParams();
  const [openDisciplineIds, setOpenDisciplineIds] = useState(
    options.map((option) => option.id),
  );

  const onSelectOption = (_, item: string) => {
    const oldFilters = searchLocation.filters[filterName] || [];
    if (oldFilters.includes(item)) {
      handleChange(
        filterName,
        searchLocation.filters[filterName].filter((it) => it !== item),
      );
    } else {
      handleChange(filterName, [...oldFilters, item]);
    }
  };

  const onClickDiscipline = (disciplineId: string) => {
    if (openDisciplineIds.includes(disciplineId)) {
      setOpenDisciplineIds(
        openDisciplineIds.filter((id) => id !== disciplineId),
      );
    } else {
      setOpenDisciplineIds([...openDisciplineIds, disciplineId]);
    }
  };

  return (
    <CollapsableFilter
      title={title}
      handleFilterToggle={handleFilterToggle}
      showExplanation={showExplanation}
    >
      <div className="px-4">
        <Typography.Body>{filtersSearch}</Typography.Body>
      </div>
      {options
        .filter((option) => option.children.length > 0)
        .map((option) => (
          <>
            <button
              type="button"
              key={option.name}
              className="pl-4 mt-2 text-sm font-medium text-gray-700 flex items-center"
              onClick={() => onClickDiscipline(option.id)}
            >
              <FilterArrow
                className={`mr-2 ${
                  openDisciplineIds.includes(option.id)
                    ? 'transform rotate-180'
                    : ''
                }`}
              />
              {option.name}
            </button>
            {openDisciplineIds.includes(option.id) && (
              <FilterOptionList
                options={option.children}
                onSelect={onSelectOption}
                selectedOptions={searchLocation.filters[filterName] || []}
                hierarchical
              />
            )}
          </>
        ))}
    </CollapsableFilter>
  );
};
