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
import { BestForFilter } from 'src/components/filterPanel/BestForFilter';
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
  const options = useFilterOptions(facets);

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
          <SubjectFilter
            options={options.subjects}
            handleChange={handleChange}
          />
          <BestForFilter
            options={options.bestFor}
            handleChange={handleChange}
          />
          <ChannelFilter
            options={options.channels}
            handleChange={handleChange}
          />
          <DurationFilter
            options={options.durations}
            handleChange={handleChange}
          />
          <DateFilter releaseDates={dateFilters} handleChange={handleChange} />
          <VideoTypeFilter
            options={options.videoTypes}
            handleChange={handleChange}
          />
          <PriceFilter options={options.prices} handleChange={handleChange} />
        </>
      )}
    </div>
  );
};
