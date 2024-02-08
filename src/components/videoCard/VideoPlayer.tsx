import React from 'react';
import { PlayerOptions } from 'boclips-player';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { Player } from 'boclips-player-react';
import { useBoclipsSecurity } from 'src/components/common/providers/BoclipsSecurityProvider';
import { BoclipsSecurity } from 'boclips-js-security/dist/BoclipsSecurity';
import { AnalyticsOptions } from 'boclips-player/dist/Events/AnalyticsOptions';
import { Link } from 'boclips-api-client/dist/sub-clients/common/model/LinkEntity';
import s from './VideoPlayer.module.less';

const getPlayerOptions = (
  security: BoclipsSecurity,
  playerControls?: string,
  showDurationBadge?: boolean,
  analytics?: Partial<AnalyticsOptions>,
): Partial<PlayerOptions> => {
  const tokenFactory = security.getTokenFactory(5);

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

  return {
    interface: {
      controls,
      ratio: '16:9',
      addons: {
        videoLengthPreview: showDurationBadge,
        titleOverlay: false,
      },
    },
    displayAutogeneratedCaptions: true,
    api: {
      tokenFactory: async () => {
        try {
          return await tokenFactory();
        } catch (error) {
          throw error('Please log in to view this video');
        }
      },
    },
    analytics: {
      metadata: {},
      handleOnSegmentPlayback: () => {},
      ...analytics,
    },
  };
};

interface Props {
  video?: Video;
  videoLink?: Link;
  controls?: 'cart';
  showDurationBadge?: boolean;
  setRef?: any;
  analytics?: Partial<AnalyticsOptions>;
}

export const VideoPlayer = ({
  video,
  videoLink,
  controls,
  showDurationBadge = false,
  setRef = () => null,
  analytics,
}: Props) => {
  const options = getPlayerOptions(
    useBoclipsSecurity(),
    controls,
    showDurationBadge,
    analytics,
  );

  return (
    <div data-qa="player" className={s.playerWrapper}>
      <Player
        playerRef={setRef}
        videoUri={
          video?.links?.self.getOriginalLink() || videoLink.getOriginalLink()
        }
        borderRadius="4px"
        options={options}
      />
    </div>
  );
};
