import React, { useEffect, useRef } from 'react';

type KalturaPlayerInstance = {
  loadMedia: (params: { entryId: string }) => void;
  destroy: () => void;
};

declare global {
  interface Window {
    KalturaPlayer: {
      setup: (config: {
        targetId: string;
        provider: {
          partnerId: string;
          ks: string;
          uiConfId: string;
        };
        playback?: {
          autoplay?: boolean;
        };
      }) => KalturaPlayerInstance;
    };
  }
}

interface KalturaVideoPlayerProps {
  targetId: string;
  partnerId: string;
  uiConfId: string;
  entryId: string;
  width?: string;
  height?: string;
}

export const KalturaVideoPlayer = ({
  targetId,
  partnerId,
  uiConfId,
  entryId,
  width = '640px',
  height = '360px',
}: KalturaVideoPlayerProps) => {
  const playerRef = useRef<KalturaPlayerInstance | null>(null);

  useEffect(() => {
    const scriptId = `kaltura-player-${partnerId}-${uiConfId}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initPlayer = () => {
      const targetElement = document.getElementById(targetId);
      if (window.KalturaPlayer && !playerRef.current && targetElement) {
        playerRef.current = window.KalturaPlayer.setup({
          targetId,
          provider: {
            partnerId,
            ks: 'KALTURA_SESSION_FOR_VIDEO_URL_DECODED',
            uiConfId,
          },
          playback: {
            autoplay: false,
          },
        });
        if (playerRef.current && entryId) {
          playerRef.current.loadMedia({ entryId });
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.src = `https://cdnapisec.kaltura.com/p/${partnerId}/embedPlaykitJs/uiconf_id/${uiConfId}`;

      script.onload = () => {
        initPlayer();
      };

      script.onerror = () => {
        console.error('Failed to load Kaltura Player script');
      };

      document.head.appendChild(script);
    } else if (window.KalturaPlayer) {
      initPlayer();
    } else {
      script.onload = () => {
        initPlayer();
      };
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [targetId, partnerId, uiConfId, entryId]);

  useEffect(() => {
    if (playerRef.current && entryId) {
      playerRef.current.loadMedia({ entryId });
    }
  }, [entryId]);

  return <div id={targetId} style={{ width, height }} />;
};
