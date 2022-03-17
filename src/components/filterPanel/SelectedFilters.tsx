import React, { useEffect, useState } from 'react';
import { SelectedFilterTag } from 'src/components/filterPanel/SelectedFilterTag';
import { FilterKey } from 'src/types/search/FilterKey';
import { useSearchQueryLocationParams } from 'src/hooks/useLocationParams';
import { getFilterLabel } from 'src/services/convertFacetsToFilterOptions';
import { useGetChannelsQuery } from 'src/hooks/api/channelQuery';
import { useGetSubjectsQuery } from 'src/hooks/api/subjectQuery';
import { useGetEducationLevelsQuery } from 'src/hooks/api/educationLevelQuery';
import { TextButton } from 'src/components/common/textButton/TextButton';
import { Typography } from '@boclips-ui/typography';

interface Props {
  removeFilter?: (filter: FilterKey, value: string) => void;
  clearFilters?: () => void;
}

export interface SelectedFilter {
  id: string;
  name: string;
  key: FilterKey;
}

export const SelectedFilters = ({ removeFilter, clearFilters }: Props) => {
  const [searchQueryLocationParams] = useSearchQueryLocationParams();

  const [filtersToRender, setFiltersToRender] = useState<SelectedFilter[]>([]);
  const { data: channels } = useGetChannelsQuery();
  const { data: subjects } = useGetSubjectsQuery();
  const { data: educationLevels } = useGetEducationLevelsQuery();

  const buildSelectedFilter = (
    selectedFilterId: string,
    filterKey: FilterKey,
  ): SelectedFilter => {
    return {
      id: selectedFilterId,
      name: getFilterLabel(
        filterKey,
        selectedFilterId,
        channels.page,
        subjects,
        educationLevels,
      ),
      key: filterKey,
    };
  };

  const releaseDateFrom =
    searchQueryLocationParams.filters.release_date_from &&
    searchQueryLocationParams.filters.release_date_from[0];

  const releaseDateTo =
    searchQueryLocationParams.filters.release_date_to &&
    searchQueryLocationParams.filters.release_date_to[0];

  useEffect(() => {
    if (searchQueryLocationParams && channels && subjects) {
      const filtersInUrl: SelectedFilter[][] = Object.entries(
        searchQueryLocationParams.filters,
      ).map(([filterKey, appliedFilters]) => {
        return appliedFilters.map((appliedFilterId) =>
          buildSelectedFilter(appliedFilterId, filterKey as FilterKey),
        );
      });

      const flattenedFiltersInUrl: SelectedFilter[] = (
        [] as SelectedFilter[]
      ).concat(...filtersInUrl);
      setFiltersToRender(flattenedFiltersInUrl);
    }
    // eslint-disable-next-line
  }, [
    searchQueryLocationParams.filters.video_type.length,
    searchQueryLocationParams.filters.channel.length,
    searchQueryLocationParams.filters.duration.length,
    searchQueryLocationParams.filters.subject.length,
    searchQueryLocationParams.filters.prices.length,
    searchQueryLocationParams.filters.best_for.length,
    searchQueryLocationParams.filters.education_level.length,
    releaseDateFrom,
    releaseDateTo,
    channels,
    subjects,
  ]);

  return (
    <>
      <div
        role="group"
        className="mb-4 flex justify-between items-center"
        style={{ height: '1.9375rem' }}
      >
        <Typography.Body weight="medium" id="selected_filters_panel">
          Selected filters
        </Typography.Body>
        <TextButton onClick={clearFilters} text="Clear all" />
      </div>
      <div
        className="flex flex-wrap"
        aria-labelledby="selected_filters_panel"
        data-qa="applied-filter-tags"
      >
        {filtersToRender.map((filter) => (
          <SelectedFilterTag
            key={`${filter.name}-${filter.id}`}
            filter={filter}
            removeFilter={removeFilter}
          />
        ))}
      </div>
    </>
  );
};
