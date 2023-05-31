import React, { useEffect, useState } from 'react';
import FilterBadge from '@boclips-ui/filter-badge';
import { FilterKey } from 'src/types/search/FilterKey';
import { useSearchQueryLocationParams } from 'src/hooks/useLocationParams';
import { getFilterLabel } from 'src/services/convertFacetsToFilterOptions';
import { useGetChannelsQuery } from 'src/hooks/api/channelQuery';
import { useGetSubjectsQuery } from 'src/hooks/api/subjectQuery';
import { useGetEducationLevelsQuery } from 'src/hooks/api/educationLevelQuery';
import { VideoFacets } from 'boclips-api-client/dist/sub-clients/videos/model/VideoFacets';

interface Props {
  removeFilter?: (filter: FilterKey, value: string) => void;
  facets: VideoFacets;
}

export interface SelectedFilter {
  id: string;
  name: string;
  key: FilterKey;
}

export const SelectedFilters = ({ removeFilter, facets }: Props) => {
  const [searchQueryLocationParams] = useSearchQueryLocationParams();

  const [filtersToRender, setFiltersToRender] = useState<SelectedFilter[]>([]);
  const { data: channels } = useGetChannelsQuery();
  const { data: subjects } = useGetSubjectsQuery();
  const { data: educationLevels } = useGetEducationLevelsQuery();

  const buildSelectedFilter = (
    id: string,
    filterKey: FilterKey,
  ): SelectedFilter => {
    return {
      id,
      name:
        getFilterLabel(
          filterKey,
          id,
          channels.page,
          subjects,
          educationLevels,
          facets?.languages,
          facets?.videoSubtypes,
        ) || id,
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
      const appliedFilters = {
        ...searchQueryLocationParams?.filters,
      };
      const filters: SelectedFilter[] = [];

      for (const filter in appliedFilters) {
        if (filter !== 'topics' && appliedFilters[filter].length > 0) {
          appliedFilters[filter].forEach((id) => {
            filters.push(buildSelectedFilter(id, filter as FilterKey));
          });
        }
      }

      setFiltersToRender(filters);
    }
    // eslint-disable-next-line
  }, [
    searchQueryLocationParams.filters.video_type.length,
    searchQueryLocationParams.filters.channel.length,
    searchQueryLocationParams.filters.duration.length,
    searchQueryLocationParams.filters.subject.length,
    searchQueryLocationParams.filters.best_for.length,
    searchQueryLocationParams.filters.education_level.length,
    searchQueryLocationParams.filters.topics.length,
    searchQueryLocationParams.filters.language.length,
    releaseDateFrom,
    releaseDateTo,
    channels,
    subjects,
    facets,
    facets?.languages,
    facets?.videoSubtypes,
  ]);

  return (
    <div
      role="region"
      className="flex flex-wrap"
      aria-label="Selected filters panel"
      data-qa="applied-filter-tags"
    >
      {filtersToRender.map((filter) => (
        <FilterBadge
          key={`${filter.name}-${filter.id}`}
          label={filter.name}
          sourceFilter={filter.key}
          value={filter.id}
          onClose={removeFilter}
        />
      ))}
    </div>
  );
};
