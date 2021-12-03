import React from 'react';
import { VideoFacets } from 'boclips-api-client/dist/sub-clients/videos/model/VideoFacets';
import { VideoTypeFilter } from 'src/components/filterPanel/VideoTypeFilter';
import { SubjectFilter } from 'src/components/filterPanel/SubjectFilter';
import { ChannelFilter } from 'src/components/filterPanel/ChannelFilter';
import { DurationFilter } from 'src/components/filterPanel/DurationFilter';
import { useFilterOptions } from 'src/hooks/useFilterOptions';
import { PriceFilter } from 'src/components/filterPanel/PriceFilter';
import c from 'classnames';
import { DateFilter } from 'src/components/filterPanel/DateFilter';
import { SelectedFilters } from './SelectedFilters';

export interface DateFilters {
  to: string[];
  from: string[];
}

interface Props {
  facets?: VideoFacets;
  handleChange: (filter: string, values: string[]) => void;
  removeFilter: (filter: string, value: string) => void;
  removeAllFilters: () => void;
  resultsFound: boolean;
  areFiltersApplied: boolean;
  dateFilters: DateFilters;
}

export const FilterPanel = ({
  facets,
  handleChange,
  removeFilter,
  removeAllFilters,
  resultsFound,
  areFiltersApplied,
  dateFilters,
}: Props) => {
  const filterOptions = useFilterOptions(facets);
  const isDurationFilterApplied = filterOptions.durations.find(
    (it) => it.hits > 0,
  );

  if (!resultsFound && !areFiltersApplied) return null;

  return (
    <div className="col-start-2 col-end-8">
      <div
        className={c('text-primary text-lg font-medium', {
          'pb-4': areFiltersApplied,
        })}
      >
        Filter by:
      </div>
      {areFiltersApplied && (
        <SelectedFilters
          removeFilter={removeFilter}
          clearFilters={removeAllFilters}
        />
      )}
      {resultsFound && (
        <>
          {filterOptions.videoTypes.length > 0 && (
            <VideoTypeFilter
              options={filterOptions.videoTypes}
              handleChange={handleChange}
            />
          )}
          {isDurationFilterApplied && (
            <DurationFilter
              options={filterOptions.durations}
              handleChange={handleChange}
            />
          )}
          <DateFilter releaseDates={dateFilters} handleChange={handleChange} />
          {filterOptions.channels.length > 0 && (
            <ChannelFilter
              options={filterOptions.channels}
              handleChange={handleChange}
            />
          )}
          {filterOptions.prices.length > 0 && (
            <PriceFilter
              options={filterOptions.prices}
              handleChange={handleChange}
            />
          )}
          {filterOptions.subjects.length > 0 && (
            <SubjectFilter
              options={filterOptions.subjects}
              handleChange={handleChange}
            />
          )}
        </>
      )}
    </div>
  );
};
