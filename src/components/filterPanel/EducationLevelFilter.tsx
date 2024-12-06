import React from 'react';
import { CheckboxFilter } from '@components/filterPanel/filter/CheckboxFilter';
import { sortFilterOptions } from '@src/services/sortFilterOptions';
import { FilterOption } from '@src/types/FilterOption';

interface Props {
  options: FilterOption[];
  handleChange?: (filter: string, values: string[]) => void;
}

export const EducationLevelFilter = ({ options = [], handleChange }: Props) => {
  const hasOptions = options.length > 0;

  return hasOptions ? (
    <CheckboxFilter
      options={sortFilterOptions(options)}
      title="Education Level"
      handleChange={handleChange}
      filterName="education_level"
    />
  ) : null;
};
