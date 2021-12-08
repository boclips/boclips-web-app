import {
  FacetFactory,
  FacetsFactory,
} from 'boclips-api-client/dist/test-support/FacetsFactory';
import { SearchFilters } from 'src/hooks/useLocationParams';
import { convertFacetsToFilterOptions } from 'src/services/convertFacetsToFilterOptions';

describe('convertFacets', () => {
  it('can convert every facet type to a filter option with filter keys', () => {
    const facets = FacetsFactory.sample({
      subjects: [FacetFactory.sample({ id: '1' })],
      durations: [FacetFactory.sample({ id: '2' })],
      videoTypes: [FacetFactory.sample({ id: '3' })],
      channels: [FacetFactory.sample({ id: '4' })],
      prices: [FacetFactory.sample({ id: '5' })],
    });

    const searchFilters: SearchFilters = {
      video_type: [],
      channel: [],
      subject: [],
      duration: [],
      prices: [],
      release_date_from: [],
      release_date_to: [],
    };

    const filterOptions = convertFacetsToFilterOptions(facets, searchFilters);
    expect(filterOptions.channels[0].id).toEqual('4');
    expect(filterOptions.channels[0].key).toEqual('channel');
    expect(filterOptions.videoTypes[0].id).toEqual('3');
    expect(filterOptions.videoTypes[0].key).toEqual('video_type');
    expect(filterOptions.durations[0].id).toEqual('2');
    expect(filterOptions.durations[0].key).toEqual('duration');
    expect(filterOptions.subjects[0].id).toEqual('1');
    expect(filterOptions.subjects[0].key).toEqual('subject');
    expect(filterOptions.prices[0].id).toEqual('5');
    expect(filterOptions.prices[0].key).toEqual('prices');
  });

  it('returns empty lists when facets are null', () => {
    const filterOptions = convertFacetsToFilterOptions(null, null);

    expect(filterOptions.subjects).toHaveLength(0);
    expect(filterOptions.videoTypes).toHaveLength(0);
    expect(filterOptions.channels).toHaveLength(0);
    expect(filterOptions.durations).toHaveLength(0);
    expect(filterOptions.prices).toHaveLength(0);
  });

  it('converts video type facet name to display name', () => {
    const facets = FacetsFactory.sample({
      videoTypes: [
        FacetFactory.sample({ name: 'NEWS' }),
        FacetFactory.sample({ name: 'INSTRUCTIONAL' }),
        FacetFactory.sample({ name: 'STOCK' }),
      ],
    });

    const filterOptions = convertFacetsToFilterOptions(facets, null);
    expect(filterOptions.videoTypes[0].name).toEqual('News');
    expect(filterOptions.videoTypes[1].name).toEqual('Instructional');
    expect(filterOptions.videoTypes[2].name).toEqual('Raw Footage');
  });

  it('converts duration facet name to display name', () => {
    const facets = FacetsFactory.sample({
      durations: [
        FacetFactory.sample({ name: 'PT0S-PT1M' }),
        FacetFactory.sample({ name: 'PT1M-PT5M' }),
        FacetFactory.sample({ name: 'PT5M-PT10M' }),
        FacetFactory.sample({ name: 'PT10M-PT20M' }),
        FacetFactory.sample({ name: 'PT20M-PT24H' }),
      ],
    });

    const filterOptions = convertFacetsToFilterOptions(facets, null);
    expect(filterOptions.durations[0].name).toEqual('Up to 1 min');
    expect(filterOptions.durations[1].name).toEqual('1 - 5 min');
    expect(filterOptions.durations[2].name).toEqual('5 - 10 min');
    expect(filterOptions.durations[3].name).toEqual('10 - 20 min');
    expect(filterOptions.durations[4].name).toEqual('20 min +');
  });

  it('converts price facet name to display price', () => {
    const facets = FacetsFactory.sample({
      prices: [
        FacetFactory.sample({ name: '10000' }),
        FacetFactory.sample({ name: '20000' }),
        FacetFactory.sample({ name: '30000' }),
        FacetFactory.sample({ name: '40000' }),
        FacetFactory.sample({ name: '50000' }),
      ],
    });

    const filterOptions = convertFacetsToFilterOptions(facets, null);
    expect(filterOptions.prices[0].name).toEqual('$100');
    expect(filterOptions.prices[1].name).toEqual('$200');
    expect(filterOptions.prices[2].name).toEqual('$300');
    expect(filterOptions.prices[3].name).toEqual('$400');
    expect(filterOptions.prices[4].name).toEqual('$500');
  });
});
