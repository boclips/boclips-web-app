import React from 'react';
import { SearchableFilter } from '@src/components/filterPanel/filter/SearchableFilter';
import { FilterOption } from '@src/types/FilterOption';

interface Props {
  options: FilterOption[];
  handleChange: (filter: string, values: string[]) => void;
}

export const ChannelFilter = ({ options, handleChange }: Props) => {
  const hasOptions = options.length > 0;

  return hasOptions ? (
    <SearchableFilter
      options={options}
      title="Channel"
      filterName="channel"
      handleChange={handleChange}
    />
  ) : null;
};
