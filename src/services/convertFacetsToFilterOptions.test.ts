import {
  FacetFactory,
  FacetsFactory,
} from 'boclips-api-client/dist/test-support/FacetsFactory';
import {
  convertFacetsToFilterOptions,
  getFilterLabel,
} from 'src/services/convertFacetsToFilterOptions';

describe('convertFacets', () => {
  it('can convert every facet type to a filter option with filter keys', () => {
    const facets = FacetsFactory.sample({
      subjects: [FacetFactory.sample({ id: '1' })],
      durations: [FacetFactory.sample({ id: '2' })],
      bestForTags: [FacetFactory.sample({ id: 'hooks', hits: 2 })],
      videoTypes: [FacetFactory.sample({ id: '3' })],
      channels: [FacetFactory.sample({ id: '4' })],
      educationLevels: [
        FacetFactory.sample({ id: 'EL1', hits: 9, name: 'EL1 label' }),
        FacetFactory.sample({ id: 'EL2', hits: 52, name: 'EL2 label' }),
      ],
      languages: [FacetFactory.sample({ id: 'eng', hits: 9, name: 'English' })],
      cefrLevels: [FacetFactory.sample({ id: 'A1', hits: 42, name: 'A1' })],
      videoSubtypes: [
        FacetFactory.sample({ id: 'ANIMATION', name: 'Animation', hits: 12 }),
      ],
    });

    const filterOptions = convertFacetsToFilterOptions(facets, null);

    expect(filterOptions.channels[0].id).toEqual('4');
    expect(filterOptions.channels[0].key).toEqual('channel');
    expect(filterOptions.videoTypes[0].id).toEqual('3');
    expect(filterOptions.videoTypes[0].key).toEqual('video_type');
    expect(filterOptions.durations[0].id).toEqual('2');
    expect(filterOptions.durations[0].key).toEqual('duration');
    expect(filterOptions.bestFor[0].id).toEqual('hooks');
    expect(filterOptions.bestFor[0].key).toEqual('best_for');
    expect(filterOptions.bestFor[0].hits).toEqual(2);
    expect(filterOptions.subjects[0].id).toEqual('1');
    expect(filterOptions.subjects[0].key).toEqual('subject');

    expect(filterOptions.educationLevels[0].id).toEqual('EL1');
    expect(filterOptions.educationLevels[0].key).toEqual('education_level');
    expect(filterOptions.educationLevels[0].hits).toEqual(9);
    expect(filterOptions.educationLevels[0].name).toEqual('EL1 label');

    expect(filterOptions.educationLevels[1].id).toEqual('EL2');
    expect(filterOptions.educationLevels[1].key).toEqual('education_level');
    expect(filterOptions.educationLevels[1].hits).toEqual(52);
    expect(filterOptions.educationLevels[1].name).toEqual('EL2 label');

    expect(filterOptions.languages[0].id).toEqual('eng');
    expect(filterOptions.languages[0].key).toEqual('language');
    expect(filterOptions.languages[0].hits).toEqual(9);
    expect(filterOptions.languages[0].name).toEqual('English');

    expect(filterOptions.cefrLevels[0].id).toEqual('A1');
    expect(filterOptions.cefrLevels[0].key).toEqual('cefr_level');
    expect(filterOptions.cefrLevels[0].hits).toEqual(42);
    expect(filterOptions.cefrLevels[0].name).toEqual('A1 Beginner');

    expect(filterOptions.videoSubtypes[0].id).toEqual('ANIMATION');
    expect(filterOptions.videoSubtypes[0].key).toEqual('subtype');
    expect(filterOptions.videoSubtypes[0].hits).toEqual(12);
    expect(filterOptions.videoSubtypes[0].name).toEqual('Animation');
  });

  it('returns empty lists when facets are null', () => {
    const filterOptions = convertFacetsToFilterOptions(null, null);

    expect(filterOptions.subjects).toHaveLength(0);
    expect(filterOptions.videoTypes).toHaveLength(0);
    expect(filterOptions.bestFor).toHaveLength(0);
    expect(filterOptions.channels).toHaveLength(0);
    expect(filterOptions.durations).toHaveLength(0);
    expect(filterOptions.cefrLevels).toHaveLength(0);
    expect(filterOptions.videoSubtypes).toHaveLength(0);
  });

  it('converts video type facet name to display name', () => {
    const facets = FacetsFactory.sample({
      videoTypes: [
        FacetFactory.sample({ name: 'NEWS' }),
        FacetFactory.sample({ name: 'INSTRUCTIONAL' }),
        FacetFactory.sample({ name: 'STOCK' }),
        FacetFactory.sample({ name: 'PODCAST' }),
      ],
    });

    const filterOptions = convertFacetsToFilterOptions(facets, null);
    expect(filterOptions.videoTypes[0].name).toEqual('News');
    expect(filterOptions.videoTypes[1].name).toEqual('Instructional');
    expect(filterOptions.videoTypes[2].name).toEqual('Stock Footage');
    expect(filterOptions.videoTypes[3].name).toEqual('Podcast');
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

  it('converts cefr level facets to correct display name', () => {
    const facets = FacetsFactory.sample({
      cefrLevels: [
        FacetFactory.sample({ name: 'A1' }),
        FacetFactory.sample({ name: 'A2' }),
        FacetFactory.sample({ name: 'B1' }),
        FacetFactory.sample({ name: 'B2' }),
        FacetFactory.sample({ name: 'C1' }),
        FacetFactory.sample({ name: 'C2' }),
      ],
    });

    const filterOptions = convertFacetsToFilterOptions(facets, null);
    expect(filterOptions.cefrLevels[0].name).toEqual('A1 Beginner');
    expect(filterOptions.cefrLevels[1].name).toEqual('A2 Elementary');
    expect(filterOptions.cefrLevels[2].name).toEqual('B1 Intermediate');
    expect(filterOptions.cefrLevels[3].name).toEqual('B2 Upper Intermediate');
    expect(filterOptions.cefrLevels[4].name).toEqual('C1 Advanced');
    expect(filterOptions.cefrLevels[5].name).toEqual('C2 Proficiency');
  });

  it('handles valid lowercase cefr level codes', () => {
    const facets = FacetsFactory.sample({
      cefrLevels: [FacetFactory.sample({ name: 'a1' })],
    });

    const filterOptions = convertFacetsToFilterOptions(facets, null);
    expect(filterOptions.cefrLevels[0].name).toEqual('A1 Beginner');
  });

  it('converts invalid cefr level code to itself', () => {
    const facets = FacetsFactory.sample({
      cefrLevels: [FacetFactory.sample({ name: 'a11' })],
    });

    const filterOptions = convertFacetsToFilterOptions(facets, null);
    expect(filterOptions.cefrLevels[0].name).toEqual('a11');
  });

  describe('Converting id to display name from facet', () => {
    it('can convert language code to display name from facets', () => {
      const label = getFilterLabel(
        'language',
        'eng',
        [],
        [],
        [],
        [FacetFactory.sample({ id: 'eng', name: 'English' })],
      );
      expect(label).toEqual('English');
    });

    it('can convert subtype id to display name from facets', () => {
      const label = getFilterLabel(
        'subtype',
        'ANIMATION',
        [],
        [],
        [],
        [],
        [FacetFactory.sample({ id: 'ANIMATION', name: 'Animation' })],
      );
      expect(label).toEqual('Animation');
    });
  });
});
