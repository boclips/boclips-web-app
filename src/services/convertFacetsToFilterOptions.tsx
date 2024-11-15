import {
  Facet,
  VideoFacets,
} from 'boclips-api-client/dist/sub-clients/videos/model/VideoFacets';
import React from 'react';
import { Filters } from '@src/hooks/useFilterOptions';
import { SearchFilters } from '@src/hooks/useLocationParams';
import { DEFAULT_DURATIONS } from '@src/types/DefaultDurations';
import { FilterOption } from '@src/types/FilterOption';
import { FilterKey } from '@src/types/search/FilterKey';
import { Channel } from 'boclips-api-client/dist/sub-clients/channels/model/Channel';
import { Subject } from 'boclips-api-client/dist/sub-clients/subjects/model/Subject';
import dayjs from 'dayjs';
import { EducationLevel } from 'boclips-api-client/dist/sub-clients/educationLevels/model/EducationLevel';

export const convertFacetsToFilterOptions = (
  facets?: VideoFacets,
  appliedFilters?: SearchFilters,
): Filters => {
  const safeFacets = {
    channels: facets?.channels || [],
    subjects: facets?.subjects || [],
    bestFor: facets?.bestForTags || [],
    videoTypes: facets?.videoTypes || [],
    durations: facets?.durations || [],
    educationLevels: facets?.educationLevels || [],
    languages: facets?.languages || [],
    cefrLevels: facets?.cefrLevels || [],
    videoSubtypes: facets?.videoSubtypes || [],
  };

  return {
    channels: createFilterOptions(
      safeFacets.channels,
      appliedFilters?.channel || [],
      'channel',
    ),
    subjects: createFilterOptions(
      safeFacets.subjects,
      appliedFilters?.subject || [],
      'subject',
    ),
    bestFor: createFilterOptions(
      safeFacets.bestFor,
      appliedFilters?.best_for || [],
      'best_for',
    ),
    videoTypes: createFilterOptions(
      safeFacets.videoTypes,
      appliedFilters?.video_type || [],
      'video_type',
      getVideoTypeLabel,
    ),
    durations: createFilterOptions(
      safeFacets.durations,
      appliedFilters?.duration || [],
      'duration',
      getDurationLabel,
    ),
    educationLevels: createFilterOptions(
      safeFacets.educationLevels,
      appliedFilters?.education_level || [],
      'education_level',
    ),
    languages: createFilterOptions(
      safeFacets.languages,
      appliedFilters?.language || [],
      'language',
    ),
    cefrLevels: createFilterOptions(
      safeFacets.cefrLevels,
      [],
      'cefr_level',
      getCefrLevelLabel,
    ),
    videoSubtypes: createFilterOptions(
      safeFacets.videoSubtypes,
      appliedFilters?.subtype || [],
      'subtype',
    ),
  };
};

const createFilterOptions = (
  facetsForOneCategory: Facet[],
  selectedFiltersIds: string[],
  filterKey: FilterKey,
  convertName?: (rawName: string) => string,
): FilterOption[] =>
  facetsForOneCategory.map((facet) => {
    const name = convertName ? convertName(facet.name) : facet.name;
    return {
      name,
      label: <span>{name}</span>,
      hits: facet.hits,
      id: facet.id,
      isSelected: selectedFiltersIds.includes(facet.id),
      key: filterKey,
    };
  });

export const getFilterLabel = (
  key: FilterKey,
  id,
  channels?: Channel[],
  subjects?: Subject[],
  educationLevels?: EducationLevel[],
  languages?: Facet[],
  subtypes?: Facet[],
): string => {
  switch (key) {
    case 'video_type':
      return getVideoTypeLabel(id);
    case 'duration':
      return getDurationLabel(id);
    case 'channel':
      return getChannelLabel(id, channels);
    case 'subject':
      return getSubjectsLabel(id, subjects);
    case 'best_for':
      return id;
    case 'education_level':
      return getEducationLevelsLabel(id, educationLevels);
    case 'release_date_from':
      return `From: ${dayjs(id).format('MM-DD-YYYY')}`;
    case 'release_date_to':
      return `To: ${dayjs(id).format('MM-DD-YYYY')}`;
    case 'language':
      return languages?.find((l) => l.id === id)?.name;
    case 'cefr_level':
      return getCefrLevelLabel(id);
    case 'subtype':
      return subtypes?.find((l) => l.id === id)?.name;
    default:
      throw 'not supported filter key';
  }
};

const getChannelLabel = (id, channels?: Channel[]) => {
  if (!channels) {
    return id;
  }
  return channels.find((it) => it.id === id)?.name || id;
};

const getSubjectsLabel = (id, subjects?: Subject[]) => {
  if (!subjects) {
    return id;
  }
  return subjects.find((it) => it.id === id)?.name || id;
};

const getVideoTypeLabel = (name: string): string => {
  switch (name.toUpperCase()) {
    case 'INSTRUCTIONAL':
      return 'Instructional';
    case 'STOCK':
      return 'Stock Footage';
    case 'NEWS':
      return 'News';
    case 'HISTORICAL_NEWS_ARCHIVE':
      return 'Historical News Archive';
    case 'PODCAST':
      return 'Podcast';
    default:
      return name;
  }
};

const getDurationLabel = (name: string): string => {
  switch (name) {
    case DEFAULT_DURATIONS[0]:
      return 'Up to 1 min';
    case DEFAULT_DURATIONS[1]:
      return '1 - 5 min';
    case DEFAULT_DURATIONS[2]:
      return '5 - 10 min';
    case DEFAULT_DURATIONS[3]:
      return '10 - 20 min';
    case DEFAULT_DURATIONS[4]:
      return '20 min +';
    default:
      return name;
  }
};

const getCefrLevelLabel = (name: string): string => {
  switch (name.toUpperCase()) {
    case 'A1':
      return 'A1 Beginner';
    case 'A2':
      return 'A2 Elementary';
    case 'B1':
      return 'B1 Intermediate';
    case 'B2':
      return 'B2 Upper Intermediate';
    case 'C1':
      return 'C1 Advanced';
    case 'C2':
      return 'C2 Proficiency';
    default:
      return name;
  }
};

const getEducationLevelsLabel = (
  code: string,
  educationLevels?: EducationLevel[],
) => {
  return educationLevels
    ? educationLevels.find((it) => it.code === code).label
    : code;
};
