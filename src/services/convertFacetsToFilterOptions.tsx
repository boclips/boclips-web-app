import {
  Facet,
  VideoFacets,
} from 'boclips-api-client/dist/sub-clients/videos/model/VideoFacets';
import React from 'react';
import { Filters } from 'src/hooks/useFilterOptions';
import { SearchFilters } from 'src/hooks/useLocationParams';
import { DEFAULT_DURATIONS } from 'src/types/DefaultDurations';
import { FilterOption } from 'src/types/FilterOption';
import { createPriceDisplayValue } from 'src/services/createPriceDisplayValue';
import { FilterKey } from 'src/types/search/FilterKey';
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
    prices: facets?.prices || [],
    educationLevels: facets?.educationLevels || [],
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
    prices: createFilterOptions(
      safeFacets.prices,
      appliedFilters?.prices || [],
      'prices',
      getPriceLabel,
    ),
    educationLevels: createFilterOptions(
      safeFacets.educationLevels,
      appliedFilters?.education_level || [],
      'education_level',
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
): string => {
  switch (key) {
    case 'video_type':
      return getVideoTypeLabel(id);
    case 'duration':
      return getDurationLabel(id);
    case 'prices':
      return getPriceLabel(id);
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
    default:
      throw 'not supported filter key';
  }
};

const getChannelLabel = (id, channels?: Channel[]) => {
  return channels ? channels.find((it) => it.id === id).name : id;
};

const getSubjectsLabel = (id, subjects?: Subject[]) => {
  return subjects ? subjects.find((it) => it.id === id).name : id;
};

const getVideoTypeLabel = (name: string): string => {
  switch (name.toUpperCase()) {
    case 'INSTRUCTIONAL':
      return 'Instructional';
    case 'STOCK':
      return 'Stock Footage';
    case 'NEWS':
      return 'News';
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

const getPriceLabel = (name: string): string => {
  const price = `${name.slice(0, name.length - 2)}.${name.slice(
    name.length - 2,
  )}`;
  return createPriceDisplayValue(parseFloat(price), 'USD') || name;
};

const getEducationLevelsLabel = (
  code: string,
  educationLevels?: EducationLevel[],
) => {
  return educationLevels
    ? educationLevels.find((it) => it.code === code).label
    : code;
};
