import { AnalyticsOptions } from 'boclips-player/dist/Events/AnalyticsOptions';
import BoclipsSecurity from 'boclips-js-security/dist/BoclipsSecurity';
import { PlayerOptions } from 'boclips-player';

const getPlayerOptions = (
  playerControls?: string,
  showDurationBadge?: boolean,
  analytics?: Partial<AnalyticsOptions>,
): Partial<PlayerOptions> => {
  const security = BoclipsSecurity.getInstance();

  const defaultControls: any[] = [
    'play-large',
    'play',
    'progress',
    'current-time',
    'duration',
    'mute',
    'volume',
    'captions',
    'fullscreen',
    'settings',
  ];

  const cartControls: any[] = [
    'play-large',
    'play',
    'progress',
    'current-time',
    'mute',
    'volume',
    'fullscreen',
  ];

  const controls = playerControls === 'cart' ? cartControls : defaultControls;

  const options: Partial<PlayerOptions> = {
    interface: {
      controls,
      addons: {
        videoLengthPreview: showDurationBadge,
        titleOverlay: false,
      },
    },
    displayAutogeneratedCaptions: true,
    analytics: {
      metadata: {},
      handleOnSegmentPlayback: () => {},
      ...analytics,
    },
  };

  if (security) {
    const tokenFactory = security.getTokenFactory(5);

    options.api = {
      tokenFactory: async () => {
        try {
          return await tokenFactory();
        } catch (error) {
          throw error('Please log in to view this video');
        }
      },
    };
  }

  return options;
};

export default getPlayerOptions;