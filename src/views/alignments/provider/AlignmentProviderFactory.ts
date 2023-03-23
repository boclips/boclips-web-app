import { Provider } from 'boclips-api-client/dist/sub-clients/alignments/model/provider/Provider';

export const getTestProviderByName = (provider: string): Provider => {
  switch (provider.toLowerCase().split('-').join(' ')) {
    case 'openstax':
      return {
        name: 'OpenStax',
        navigationPath: 'openstax',
        types: ['Math', 'Business'],
        description:
          'Explore our video library, expertly curated for your ebook',
        logoUrl:
          'https://assets.boclips.com/boclips-public-static-files/boclips/openstax/openstax_ally_logo.png',
        defaultThemeLogoUrl:
          'https://assets.boclips.com/boclips-public-static-files/boclips/openstax/OSX-ALLY-Blue-RGB-150dpi.png',
      };
    case 'ngss':
      return {
        name: 'NGSS',
        navigationPath: 'ngss',
        types: ['High School', 'Middle School'],
        description:
          'Explore our K12 science library, which includes experiments and real-world applications',
        logoUrl:
          'https://assets.boclips.com/boclips-public-static-files/boclips/sparks/ngss/ngss-big-logo.png',
        defaultThemeLogoUrl:
          'https://assets.boclips.com/boclips-public-static-files/boclips/sparks/ngss/ngss-theme-logo.png',
      };
    case 'common core math':
      return {
        name: 'Common Core Math',
        navigationPath: 'common-core-math',
        types: ['High School', 'Middle School'],
        description:
          'Explore our video collection, aligned to each learning standard',
        logoUrl:
          'https://assets.boclips.com/boclips-public-static-files/boclips/sparks/common-core-math/common-core-math-big-logo.png',
        defaultThemeLogoUrl:
          'https://assets.boclips.com/boclips-public-static-files/boclips/sparks/common-core-math/common-core-math-theme-logo.jpg',
      };
    default:
      throw new Error(`Provider '${provider}' not supported`);
  }
};

const SUPPORTED_PROVIDERS = ['openstax', 'ngss', 'common core math'];
export const isProviderSupported = (providerName: string) =>
  SUPPORTED_PROVIDERS.includes(providerName.toLowerCase().split('-').join(' '));
