import { Typography } from '@boclips-ui/typography';
import React, { useState } from 'react';
import { FilterOptionList } from '@src/components/filterPanel/filter/FilterOptionList';
import { useSearchQueryLocationParams } from '@src/hooks/useLocationParams';
import { FilterOption } from '@src/types/FilterOption';
import { CollapsableFilter } from '../CollapsableFilter';
import { DisciplineHeader } from './DisciplineHeader';

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
  numberOfSelectedSubjects: number;
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
  const [openDisciplineIds, setOpenDisciplineIds] = useState([]);

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

  const isOpen = (option: HierarchicalFilterOption) =>
    openDisciplineIds.includes(option.id);

  return (
    <CollapsableFilter
      title={title}
      handleFilterToggle={handleFilterToggle}
      showExplanation={showExplanation}
    >
      <div className="px-4">
        <Typography.Body>{filtersSearch}</Typography.Body>
      </div>
      {options.map((option) => (
        <>
          <DisciplineHeader
            name={option.name}
            onClick={() => onClickDiscipline(option.id)}
            isOpen={isOpen(option)}
            selectedSubjects={option.numberOfSelectedSubjects}
          />
          {isOpen(option) && (
            <FilterOptionList
              options={option.children}
              onSelect={onSelectOption}
              selectedOptions={searchLocation.filters[filterName] || []}
              hierarchical
              showAll
            />
          )}
        </>
      ))}
    </CollapsableFilter>
  );
};
