import { getProviderByName } from 'src/views/openstax/provider/AlignmentProviderFactory';

describe('Provider Factory', () => {
  it('openstax provider is returned', () => {
    const provider = getProviderByName('openstax');

    expect(provider.name).toEqual('OpenStax');
    expect(provider.navigationPath).toEqual('openstax');
    expect(provider.header).toEqual('Our OpenStax collection');
    expect(provider.description).toEqual(
      'Explore our video library, expertly curated for your ebook',
    );
    expect(provider.types).toEqual([
      'Business',
      'College Success',
      'High School',
      'Humanities',
      'Math',
      'Science',
      'Social Science',
    ]);
  });

  it('ngss provider is returned', () => {
    const provider = getProviderByName('NGSS');

    expect(provider.name).toEqual('NGSS');
    expect(provider.navigationPath).toEqual('ngss');
    expect(provider.header).toEqual('Our NGSS collection');
    expect(provider.description).toEqual(
      'Explore our K12 science library, which includes experiments and real-world applications',
    );
    expect(provider.types).toEqual([
      'Elementary School',
      'High School',
      'Middle School',
      'Teacher Resources',
    ]);
  });

  it('common core math provider is returned', () => {
    const provider = getProviderByName('common-core-math');

    expect(provider.name).toEqual('Common Core Math');
    expect(provider.navigationPath).toEqual('common-core-math');
    expect(provider.header).toEqual('Our Common Core Math collection');
    expect(provider.description).toEqual(
      'Explore our video collection, aligned to each learning standard',
    );
    expect(provider.types).toEqual([
      'Elementary School',
      'High School',
      'Middle School',
    ]);
  });

  it('throws error when provider not supported', () => {
    expect(() => getProviderByName('invalid-provider')).toThrow(
      "Provider 'invalid-provider' not supported",
    );
  });
});
