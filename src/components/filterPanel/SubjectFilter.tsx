import React from 'react';
import { sortFilterOptions } from 'src/services/sortFilterOptions';
import { FilterOption } from 'src/types/FilterOption';
import { SearchableFilter } from 'src/components/filterPanel/filter/SearchableFilter';

interface Props {
  options: FilterOption[];
  handleChange: (filter: string, values: string[]) => void;
}

export const SubjectFilter = ({ options, handleChange }: Props) => {
  const hasOptions = options.length > 0;
  return hasOptions ? (
    <SearchableFilter
      options={sortFilterOptions(options, 'SORT_BY_HITS_AND_NAME')}
      title="Subject"
      filterName="subject"
      handleChange={handleChange}
    />
  ) : null;
};
