import React from 'react';
import { CheckboxFilter } from '@components/filterPanel/filter/CheckboxFilter';
import { sortFilterOptions } from '@src/services/sortFilterOptions';
import { FilterOption } from '@src/types/FilterOption';

interface Props {
  options: FilterOption[];
  handleChange?: (filter: string, values: string[]) => void;
}

export const LanguageFilter = ({ options = [], handleChange }: Props) => {
  const hasOptions = options.length > 0;

  return hasOptions ? (
    <CheckboxFilter
      options={sortFilterOptions(options)}
      title="Language"
      handleChange={handleChange}
      filterName="language"
    />
  ) : null;
};
