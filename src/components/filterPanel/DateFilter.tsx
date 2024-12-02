import React from 'react';
import { DateFilters } from '@src/components/filterPanel/FilterPanel';
import { FilterKey } from '@src/types/search/FilterKey';
import { Typography } from 'boclips-ui';
import ReleaseDateFilter from '@src/components/filterPanel/filter/releaseDateFilter/ReleaseDateFilter';
import { CollapsableFilter } from './filter/CollapsableFilter';

interface Props {
  releaseDates?: DateFilters;
  handleChange: (filterKey: FilterKey, value: string[]) => void;
}

export const DateFilter = ({ releaseDates, handleChange }: Props) => {
  const releasedFrom = releaseDates.from || [];
  const releasedTo = releaseDates.to || [];

  const setToDateFilter = (date: string) => {
    handleChange('release_date_to', [date]);
  };

  const setFromDateFilter = (date: string) => {
    handleChange('release_date_from', [date]);
  };

  return (
    <CollapsableFilter title="Release date">
      <div className="mt-2 w-full px-4">
        <div className="pb-4" data-qa="release_date_from">
          <ReleaseDateFilter
            id="date-from"
            label={<Typography.Body size="small">From:</Typography.Body>}
            value={releasedFrom[0]}
            onChange={(date) => setFromDateFilter(date.detail.value)}
          />
        </div>
        <div data-qa="release_date_to">
          <ReleaseDateFilter
            id="date-to"
            label={<Typography.Body size="small">To:</Typography.Body>}
            value={releasedTo[0]}
            onChange={(date) => setToDateFilter(date.detail.value)}
          />
        </div>
      </div>
    </CollapsableFilter>
  );
};
