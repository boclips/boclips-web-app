import React, { useMemo, useState } from 'react';
import {
  DisciplinesWithSubjectsCheckboxFilter,
  HierarchicalFilterOption,
} from 'src/components/filterPanel/filter/DisciplinesWithSubjectsCheckboxFilter';
import { FilterOption } from 'src/types/FilterOption';
import { searchFilterOptions } from 'src/services/sortFilterOptions';
import { useGetDisciplinesQuery } from 'src/hooks/api/disciplinesQuery';
import { FilterSearch } from 'src/components/filterPanel/filter/FilterSearch';

interface Props {
  options?: FilterOption[];
  handleChange: (filter: string, values: string[]) => void;
}

export const DisciplineSubjectFilter = ({ options, handleChange }: Props) => {
  const [searchText, setSearchText] = useState<string>();

  const { data: disciplines } = useGetDisciplinesQuery();

  const filteredOptions = useMemo(
    (): FilterOption[] => searchFilterOptions(options, searchText),
    [options, searchText],
  );

  const disciplinesWithSubjects: HierarchicalFilterOption[] = disciplines?.map(
    (discipline) => {
      const containedSubjectIds = discipline.subjects.map(
        (subject) => subject.id,
      );

      return {
        name: discipline.name,
        id: discipline.id,
        children: filteredOptions.filter((subject) =>
          containedSubjectIds.includes(subject.id),
        ),
      };
    },
  );

  const hasOptions = disciplines?.some(
    (discipline) => discipline.subjects.length > 0,
  );

  return hasOptions ? (
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
