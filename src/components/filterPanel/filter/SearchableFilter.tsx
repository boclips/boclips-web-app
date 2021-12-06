import React, { useMemo, useState } from 'react';
import { CheckboxFilter } from 'src/components/filterPanel/filter/CheckboxFilter';
import { FilterSearch } from 'src/components/filterPanel/filter/FilterSearch';
import { FilterOption } from 'src/types/FilterOption';
import { searchFilterOptions } from 'src/services/convertFilterOptions';

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
      filtersSearch={<FilterSearch onSearch={setSearchText} />}
      handleFilterToggle={() => setSearchText('')}
    />
  );
};
