import React from 'react';
import { CheckboxFilter } from 'src/components/filterPanel/filter/CheckboxFilter';
import { sortFilterOptions } from 'src/services/sortFilterOptions';
import { FilterOption } from 'src/types/FilterOption';
import { FeatureGate } from 'src/components/common/FeatureGate';

interface Props {
  options: FilterOption[];
  handleChange: (filter: string, values: string[]) => void;
}

export const PriceFilter = ({ options, handleChange }: Props) => {
  const hasOptions = options.length > 0;

  return hasOptions ? (
    <FeatureGate feature="BO_WEB_APP_PRICES">
      <CheckboxFilter
        options={sortFilterOptions(options, 'SORT_BY_HITS_AND_NAME')}
        title="Price"
        filterName="prices"
        handleChange={handleChange}
      />
    </FeatureGate>
  ) : null;
};
