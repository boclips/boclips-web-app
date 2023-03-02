import { getProviderByName } from 'src/views/openstax/provider/AlignmentProviderFactory';

describe('Provider Factory', () => {
  it('openstax provider is returned', () => {
    const provider = getProviderByName('openstax');

    expect(provider.header).toEqual('Our OpenStax collection');
    expect(provider.description).toEqual(
      'Explore our video library, expertly curated for your ebook',
    );
    expect(provider.imgAltText).toEqual("We're an OpenStax ally");
  });

  it('ngss provider is returned', () => {
    const provider = getProviderByName('NGSS');

    expect(provider.header).toEqual('Our NGSS collection');
    expect(provider.description).toEqual(
      'Explore our K12 science library, which includes experiments and real-world applications',
    );
    expect(provider.imgAltText).toEqual('NGSS logo');
  });

  it('common core math provider is returned', () => {
    const provider = getProviderByName('common-core-math');

    expect(provider.header).toEqual('Our Common Core Math collection');
    expect(provider.description).toEqual(
      'Explore our video collection, aligned to each learning standard',
    );
    expect(provider.imgAltText).toEqual('Common Core Math logo');
  });

  it('throws error when provider not supported', () => {
    expect(() => getProviderByName('invalid-provider')).toThrow(
      "Provider 'invalid-provider' not supported",
    );
  });
});
