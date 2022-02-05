import React from 'react';
import { DateFilters } from 'src/components/filterPanel/FilterPanel';
import { FilterKey } from 'src/types/search/FilterKey';
import dayjs from 'dayjs';
import ReleaseDateFilter from '@boclips-ui/release-date-filter';
import { CollapsableFilter } from './filter/CollapsableFilter';

interface Props {
  releaseDates?: DateFilters;
  handleChange: (filterKey: FilterKey, value: string[]) => void;
}

export const DateFilter = ({ releaseDates, handleChange }: Props) => {
  const releasedFrom = releaseDates.from || [];
  const releasedTo = releaseDates.to || [];

  const setToDateFilter = (date: dayjs.Dayjs) => {
    handleChange('release_date_to', [date.toISOString()]);
  };

  const setFromDateFilter = (date: dayjs.Dayjs) => {
    handleChange('release_date_from', [date.toISOString()]);
  };

  return (
    <CollapsableFilter title="Release date">
      <div className="mt-2 w-full px-4">
        <div data-qa="release_date_from">
          <div className="my-2">From:</div>
          <ReleaseDateFilter
            releaseDate={releasedFrom[0]}
            onChange={setFromDateFilter}
          />
        </div>
        <div data-qa="release_date_to">
          <div className="my-2">To:</div>
          <ReleaseDateFilter
            releaseDate={releasedTo[0]}
            onChange={setToDateFilter}
          />
        </div>
      </div>
    </CollapsableFilter>
  );
};
