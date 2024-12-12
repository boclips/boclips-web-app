import { SortBy } from '@src/types/SortBy';
import { Facet } from 'boclips-api-client/dist/sub-clients/videos/model/VideoFacets';
import isNumeric from 'antd/lib/_util/isNumeric';

export const getFacetSorter = (by: SortBy) => {
  if (by === 'SORT_BY_NAME') {
    return sortByName;
  }

  if (by === 'SORT_BY_HITS_AND_NAME') {
    return sortByHitsAndName;
  }

  if (by === 'SORT_BY_DURATION') {
    return sortByDuration;
  }

  return sortByHitsAndName;
};

const sortByName = (a: Facet, b: Facet) => a.name.localeCompare(b.name);

const sortByDuration = (a: Facet, b: Facet) => {
  const getNumberValues = (string: string) =>
    parseInt(
      string
        .split('')
        .filter((item) => isNumeric(item))
        .join(''),
      10,
    );

  return getNumberValues(a.id) - getNumberValues(b.id);
};

const sortByHitsAndName = (a: Facet, b: Facet) => {
  if (a.hits === b.hits) {
    return a.name.localeCompare(b.name);
  }
  return b.hits - a.hits;
};
