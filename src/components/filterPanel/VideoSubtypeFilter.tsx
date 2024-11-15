import React from 'react';
import { CheckboxFilter } from '@src/components/filterPanel/filter/CheckboxFilter';
import { sortFilterOptions } from '@src/services/sortFilterOptions';
import { FilterOption } from '@src/types/FilterOption';

interface Props {
  options: FilterOption[];
  handleChange: (filter: string, values: string[]) => void;
}

export const VideoSubtypeFilter = ({ options = [], handleChange }: Props) => {
  const hasOptions = options.length > 0;

  return hasOptions ? (
    <CheckboxFilter
      options={sortFilterOptions(options, 'SORT_BY_NAME')}
      title="Video subtype"
      handleChange={handleChange}
      filterName="subtype"
    />
  ) : null;
};
