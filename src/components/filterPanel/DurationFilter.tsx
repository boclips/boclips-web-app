import React from 'react';
import { CheckboxFilter } from 'src/components/filterPanel/filter/CheckboxFilter';
import { convertFilterOptions } from 'src/services/convertFilterOptions';
import { FilterOption } from 'src/types/FilterOption';

interface Props {
  options: FilterOption[];
  handleChange: (filter: string, values: string[]) => void;
}

export const DurationFilter = ({ options, handleChange }: Props) => {
  const isDurationFilterApplied = options.find((it) => it.hits > 0);

  return isDurationFilterApplied ? (
    <CheckboxFilter
      options={convertFilterOptions(options, 'SORT_BY_DURATION')}
      title="Duration"
      filterName="duration"
      handleChange={handleChange}
    />
  ) : null;
};
