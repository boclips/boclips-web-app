import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { FilterOptionList } from 'src/components/filterPanel/filter/FilterOptionList';
import { useSearchQueryLocationParams } from 'src/hooks/useLocationParams';
import { FilterOption } from 'src/types/FilterOption';
import { CollapsableFilter } from './CollapsableFilter';

interface Props {
  title: string;
  options: FilterOption[];
  filterName: string;
  handleChange: (filter: string, values: string[]) => void;
  filtersSearch?: React.ReactNode;
  handleFilterToggle?: (isOpen: boolean) => void;
  showExplanation?: boolean;
}

export const CheckboxFilter = ({
  title,
  options = [],
  filterName,
  handleChange,
  filtersSearch,
  handleFilterToggle,
  showExplanation,
}: Props) => {
  const [searchLocation] = useSearchQueryLocationParams();

  const onSelectOption = (_, item: string) => {
    const oldFilters = searchLocation.filters[filterName] || [];
    if (oldFilters.includes(item)) {
      handleChange(
        filterName,
        searchLocation.filters[filterName].filter((it) => it !== item),
      );
    } else {
      handleChange(filterName, [...oldFilters, item]);
    }
  };

  return (
    <CollapsableFilter
      title={title}
      handleFilterToggle={handleFilterToggle}
      showExplanation={showExplanation}
    >
      <div className="px-4">
        <Typography.Body>{filtersSearch}</Typography.Body>
      </div>
      <FilterOptionList
        options={options}
        onSelect={onSelectOption}
        selectedOptions={searchLocation.filters[filterName] || []}
      />
    </CollapsableFilter>
  );
};
