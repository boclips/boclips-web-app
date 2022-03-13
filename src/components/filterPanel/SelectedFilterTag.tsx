import React from 'react';
import { FilterKey } from 'src/types/search/FilterKey';
import CrossIconSVG from 'src/resources/icons/cross-icon.svg';
import { SelectedFilter } from 'src/components/filterPanel/SelectedFilters';
import { Typography } from '@boclips-ui/typography';

interface Props {
  filter: SelectedFilter;
  removeFilter: (filter: FilterKey, value: string) => void;
}

export const SelectedFilterTag = ({ filter, removeFilter }: Props) => {
  return (
    <Typography.Body className="py-1 pl-2 mr-1 mb-1 border-solid border-2 border-gray-500 rounded flex flex-nowrap items-center">
      {filter.name}
      <button
        type="button"
        data-qa="remove-filter"
        className="mx-1 rounded p-1 text-gray-900 hover:text-blue-800 hover:border-blue-500 hover:border-solid hover:bg-blue-400 h-5 w-5"
        onKeyPress={(_) => removeFilter(filter.key, filter.id)}
        onClick={() => removeFilter(filter.key, filter.id)}
        aria-label={`remove ${filter.name} filter`}
      >
        <CrossIconSVG className="stroke-current stroke-2 h-3 w-3" />
      </button>
    </Typography.Body>
  );
};
