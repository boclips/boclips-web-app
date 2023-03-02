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
        imgAltText: "We're an OpenStax ally",
        logoUrl:
          'https://assets.boclips.com/boclips-public-static-files/boclips/openstax/openstax_ally_logo.png',
        themeDefaultLogoUrl:
          'https://assets.boclips.com/boclips-public-static-files/boclips/openstax/OSX-ALLY-Blue-RGB-150dpi.png',
      };
    case 'ngss':
      return {
        name: 'NGSS',
        navigationPath: 'ngss',
        header: 'Our NGSS collection',
        description:
          'Explore our K12 science library, which includes experiments and real-world applications',
        imgAltText: 'NGSS logo',
        logoUrl: 'https://www.nextgenscience.org/themes/custom/ngss/logo.png',
        themeDefaultLogoUrl:
          'https://www.nextgenscience.org/sites/default/files/2022-09/accordion_logo.png',
      };
    case 'common core math':
      return {
        name: 'Common Core Math',
        navigationPath: 'common-core-math',
        header: 'Our Common Core Math collection',
        description:
          'Explore our video collection, aligned to each learning standard',
        imgAltText: 'Common Core Math logo',
        logoUrl:
          'https://seeklogo.com/images/C/common-core-state-standards-initiative-logo-B8085DE27C-seeklogo.com.png?v=637938247620000000',
        themeDefaultLogoUrl:
          'https://thewestfieldnews.com/wp-content/uploads/2015/05/image58.jpg',
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
