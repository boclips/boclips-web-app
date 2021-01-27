import React from 'react';
import { SearchableFilter } from 'src/components/filterPanel/filter/SearchableFilter';
import { FilterOption } from 'src/types/FilterOption';

interface Props {
  options: FilterOption[];
  handleChange: (filter: string, values: string[]) => void;
}

export const ChannelFilter = ({ options, handleChange }: Props) => {
  return (
    <SearchableFilter
      options={options}
      title="Channel"
      filterName="channel"
      handleChange={handleChange}
      searchPlaceholder="Search for channel"
    />
  );
};
