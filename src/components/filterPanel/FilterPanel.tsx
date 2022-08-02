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
import { Typography } from '@boclips-ui/typography';
import { EducationLevelFilter } from 'src/components/filterPanel/EducationLevelFilter';
import { TextButton } from 'src/components/common/textButton/TextButton';
import { LanguageFilter } from 'src/components/filterPanel/LanguageFilter';
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
        role="group"
        className="mb-4 flex justify-between items-center"
        style={{ height: '1.9375rem' }}
      >
        <Typography.H2
          size="xs"
          weight="medium"
          id="filter_by"
          className={c('text-gray-800', {
            'pb-2': areFiltersApplied,
          })}
        >
          Filter by:
        </Typography.H2>

        {areFiltersApplied && (
          <TextButton
            onClick={removeAllFilters}
            ariaLabel="Clear all filters"
            text="Clear all"
          />
        )}
      </div>
      {areFiltersApplied && (
        <SelectedFilters removeFilter={removeFilter} facets={facets} />
      )}
      {resultsFound && (
        <div role="group" aria-labelledby="filter_by">
          <SubjectFilter
            options={options.subjects}
            handleChange={handleChange}
          />
          <BestForFilter
            options={options.bestFor}
            handleChange={handleChange}
          />
          <LanguageFilter
            options={options.languages}
            handleChange={handleChange}
          />
          <EducationLevelFilter
            options={options.educationLevels}
            handleChange={handleChange}
          />
          <VideoTypeFilter
            options={options.videoTypes}
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
          <PriceFilter options={options.prices} handleChange={handleChange} />
        </div>
      )}
    </div>
  );
};
