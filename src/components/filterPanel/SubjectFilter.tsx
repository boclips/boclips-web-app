import React from 'react';
import { CheckboxFilter } from 'src/components/filterPanel/filter/CheckboxFilter';
import { convertFilterOptions } from 'src/services/convertFilterOptions';
import { FilterOption } from 'src/types/FilterOption';

interface Props {
  options: FilterOption[];
  handleChange: (filter: string, values: string[]) => void;
}

export const SubjectFilter = ({ options, handleChange }: Props) => {
  const hasOptions = options.length > 0;
  return hasOptions ? (
    <CheckboxFilter
      options={convertFilterOptions(options, 'SORT_BY_HITS_AND_NAME')}
      title="Subject"
      filterName="subject"
      handleChange={handleChange}
    />
  ) : (
    <></>
  );
};
