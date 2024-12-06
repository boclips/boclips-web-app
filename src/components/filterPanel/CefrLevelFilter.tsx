import React from 'react';
import { FilterOption } from '@src/types/FilterOption';
import { CheckboxFilter } from '@components/filterPanel/filter/CheckboxFilter';
import { sortFilterOptions } from '@src/services/sortFilterOptions';

interface Props {
  options: FilterOption[];
  handleChange?: (filter: string, values: string[]) => void;
}

export const CefrLevelFilter = ({ options = [], handleChange }: Props) => {
  const hasOptions = options.length > 0;

  return hasOptions ? (
    <CheckboxFilter
      options={sortFilterOptions(options, 'SORT_BY_NAME')}
      title="CEFR Language Level"
      filterName="cefr_level"
      handleChange={handleChange}
    />
  ) : null;
};
