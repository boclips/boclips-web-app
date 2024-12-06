import React, { useMemo, useState } from 'react';
import { CheckboxFilter } from '@components/filterPanel/filter/CheckboxFilter';
import { FilterSearch } from '@components/filterPanel/filter/FilterSearch';
import { FilterOption } from '@src/types/FilterOption';
import { searchFilterOptions } from '@src/services/sortFilterOptions';

interface Props {
  title: string;
  options: FilterOption[];
  filterName: string;
  handleChange: (filter: string, values: string[]) => void;
}
export const SearchableFilter = ({
  title,
  options = [],
  filterName,
  handleChange,
}: Props) => {
  const [searchText, setSearchText] = useState<string>();

  const filteredOptions = useMemo(
    (): FilterOption[] => searchFilterOptions(options, searchText),
    [options, searchText],
  );

  return (
    <CheckboxFilter
      filterName={filterName}
      title={title}
      options={filteredOptions}
      handleChange={handleChange}
      filtersSearch={<FilterSearch id={title} onSearch={setSearchText} />}
      handleFilterToggle={() => setSearchText('')}
    />
  );
};
