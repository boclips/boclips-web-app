import React, { useMemo, useState } from 'react';
import {
  DisciplinesWithSubjectsCheckboxFilter,
  HierarchicalFilterOption,
} from '@components/filterPanel/filter/disciplineSubjectFilter/DisciplinesWithSubjectsCheckboxFilter';
import { FilterOption } from '@src/types/FilterOption';
import { searchFilterOptions } from '@src/services/sortFilterOptions';
import { FilterSearch } from '@components/filterPanel/filter/FilterSearch';
import { useSearchQueryLocationParams } from '@src/hooks/useLocationParams';
import { Discipline } from 'boclips-api-client/dist/sub-clients/disciplines/model/Discipline';

interface Props {
  disciplines?: Discipline[];
  optionsAvailableForCurrentSearch?: FilterOption[];
  handleChange: (filter: string, values: string[]) => void;
}

export const DisciplineSubjectFilter = ({
  disciplines,
  optionsAvailableForCurrentSearch,
  handleChange,
}: Props) => {
  const [searchText, setSearchText] = useState<string>();

  const [searchLocation] = useSearchQueryLocationParams();
  const selectedSubjectFilters = searchLocation.filters.subject || [];

  const filteredOptions = useMemo(
    (): FilterOption[] =>
      searchFilterOptions(optionsAvailableForCurrentSearch, searchText),
    [optionsAvailableForCurrentSearch, searchText],
  );

  const disciplinesWithSubjects: HierarchicalFilterOption[] = disciplines
    ?.map((discipline) => {
      const subjectIds = discipline.subjects.map((subject) => subject.id);

      return {
        name: discipline.name,
        id: discipline.id,
        children: filteredOptions.filter((subjectOption) =>
          subjectIds.includes(subjectOption.id),
        ),
        numberOfSelectedSubjects: selectedSubjectFilters.filter((subjectId) =>
          subjectIds.includes(subjectId),
        ).length,
      };
    })
    .filter((filterOption) => filterOption.children.length > 0);

  const hasAnyDisciplinesWithSubjects = disciplines?.some(
    (discipline) => discipline.subjects.length > 0,
  );

  const hasOptionsAvailableForCurrentSearch =
    optionsAvailableForCurrentSearch?.length > 0;

  return hasAnyDisciplinesWithSubjects &&
    hasOptionsAvailableForCurrentSearch ? (
    <DisciplinesWithSubjectsCheckboxFilter
      title="Subjects"
      options={disciplinesWithSubjects}
      filterName="subject"
      handleChange={handleChange}
      filtersSearch={<FilterSearch id="Subject" onSearch={setSearchText} />}
      handleFilterToggle={() => setSearchText('')}
    />
  ) : null;
};
