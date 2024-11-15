import { VideoFacets } from 'boclips-api-client/dist/sub-clients/videos/model/VideoFacets';
import { FilterOption } from '@src/types/FilterOption';
import { useSearchQueryLocationParams } from '@src/hooks/useLocationParams';
import { convertFacetsToFilterOptions } from '@src/services/convertFacetsToFilterOptions';

export interface Filters {
  subjects: FilterOption[];
  durations: FilterOption[];
  channels: FilterOption[];
  videoTypes: FilterOption[];
  bestFor: FilterOption[];
  educationLevels: FilterOption[];
  languages: FilterOption[];
  cefrLevels: FilterOption[];
  videoSubtypes: FilterOption[];
}

export const useFilterOptions = (facets: VideoFacets): Filters => {
  const [urlParams] = useSearchQueryLocationParams();
  return convertFacetsToFilterOptions(facets, urlParams.filters);
};
