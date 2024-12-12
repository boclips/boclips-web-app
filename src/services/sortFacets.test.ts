import { getFacetSorter } from '@src/services/sortFacets';
import { Facet } from 'boclips-api-client/dist/sub-clients/videos/model/VideoFacets';

describe('Sort facets', () => {
  const testData: Facet[] = [
    {
      hits: 1,
      id: 'id-1',
      name: 'Zoo',
    },
    {
      hits: 1,
      id: 'id-2',
      name: 'Ark',
    },
    {
      hits: 2,
      id: 'id-3',
      name: 'Boat',
    },
  ];
  const testDurationData: Facet[] = [
    {
      hits: 1,
      id: 'PT20M-PT24H',
      name: 'PT20M-PT24H',
    },
    {
      hits: 4,
      id: 'PT10M-PT20M',
      name: 'PT10M-PT20M',
    },
    {
      hits: 2,
      id: 'PT5M-PT10M',
      name: 'PT5M-PT10M',
    },
    {
      hits: 4,
      id: 'PT0S-PT1M',
      name: 'PT10M-PT20M',
    },
    {
      hits: 2,
      id: 'PT1M-PT5M',
      name: 'PT5M-PT10M',
    },
  ];
  it('Sorts facets by hits and then name', () => {
    const sortedData = testData.sort(getFacetSorter('SORT_BY_HITS_AND_NAME'));
    expect(sortedData[0].id).toEqual('id-3');
    expect(sortedData[1].id).toEqual('id-2');
    expect(sortedData[2].id).toEqual('id-1');
  });

  it('Sorts facets by name', () => {
    const sortedData = testData.sort(getFacetSorter('SORT_BY_NAME'));
    expect(sortedData[0].id).toEqual('id-2');
    expect(sortedData[1].id).toEqual('id-3');
    expect(sortedData[2].id).toEqual('id-1');
  });

  it('Sorts facets by duration', () => {
    const sortedData = testDurationData.sort(
      getFacetSorter('SORT_BY_DURATION'),
    );
    expect(sortedData[0].id).toEqual('PT0S-PT1M');
    expect(sortedData[1].id).toEqual('PT1M-PT5M');
    expect(sortedData[2].id).toEqual('PT5M-PT10M');
    expect(sortedData[3].id).toEqual('PT10M-PT20M');
    expect(sortedData[4].id).toEqual('PT20M-PT24H');
  });
});
