import React from 'react';
import { CheckboxFilter } from 'src/components/filterPanel/filter/CheckboxFilter';
import { sortFilterOptions } from 'src/services/sortFilterOptions';
import { FilterOption } from 'src/types/FilterOption';

interface Props {
  options: FilterOption[];
  handleChange?: (filter: string, values: string[]) => void;
}

export const BestForFilter = ({ options = [], handleChange }: Props) => {
  const hasOptions = options.length > 0;

  return hasOptions ? (
    <CheckboxFilter
      options={sortFilterOptions(options)}
      title="Best for"
      handleChange={handleChange}
      filterName="best_for"
    />
  ) : null;
};
