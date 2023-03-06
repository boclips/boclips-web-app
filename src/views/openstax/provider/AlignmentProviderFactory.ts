import { AlignmentProvider } from 'src/views/openstax/provider/AlignmentProvider';

export const getProviderByName = (provider: string): AlignmentProvider => {
  switch (provider.toLowerCase().split('-').join(' ')) {
    case 'openstax':
      return {
        name: 'OpenStax',
        navigationPath: 'openstax',
        header: 'Our OpenStax collection',
        description:
          'Explore our video library, expertly curated for your ebook',
        logoUrl:
          'https://assets.boclips.com/boclips-public-static-files/boclips/openstax/openstax_ally_logo.png',
        themeDefaultLogoUrl:
          'https://assets.boclips.com/boclips-public-static-files/boclips/openstax/OSX-ALLY-Blue-RGB-150dpi.png',
        types: [
          'Math',
          'Science',
          'Social Science',
          'Humanities',
          'Business',
          'High School',
          'College Success',
        ].sort(),
      };
    case 'ngss':
      return {
        name: 'NGSS',
        navigationPath: 'ngss',
        header: 'Our NGSS collection',
        description:
          'Explore our K12 science library, which includes experiments and real-world applications',
        logoUrl:
          'https://assets.boclips.com/boclips-public-static-files/boclips/sparks/ngss/ngss-big-logo.png',
        themeDefaultLogoUrl:
          'https://assets.boclips.com/boclips-public-static-files/boclips/sparks/ngss/ngss-theme-logo.png',
        types: [
          'Elementary School',
          'Middle School',
          'High School',
          'Teacher Resources',
        ].sort(),
      };
    case 'common core math':
      return {
        name: 'Common Core Math',
        navigationPath: 'common-core-math',
        header: 'Our Common Core Math collection',
        description:
          'Explore our video collection, aligned to each learning standard',
        logoUrl:
          'https://assets.boclips.com/boclips-public-static-files/boclips/sparks/common-core-math/common-core-math-big-logo.png',
        themeDefaultLogoUrl:
          'https://assets.boclips.com/boclips-public-static-files/boclips/sparks/common-core-math/common-core-math-theme-logo.jpg',
        types: ['Elementary School', 'Middle School', 'High School'].sort(),
      };
    default:
      throw new Error(`Provider '${provider}' not supported`);
  }
};

const SUPPORTED_PROVIDERS = ['openstax', 'ngss', 'common core math'];
export const isProviderSupported = (providerName: string) =>
  SUPPORTED_PROVIDERS.includes(providerName.toLowerCase().split('-').join(' '));
export const getAllProviders = () =>
  SUPPORTED_PROVIDERS.map((providerName) => getProviderByName(providerName));
