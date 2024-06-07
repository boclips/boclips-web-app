import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { EmbedButton } from 'src/components/embedButton/EmbedButton';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { VideoShareCodeButton } from 'src/components/shareCodeButton/VideoShareCodeButton';
import { DownloadTranscriptButton } from 'src/components/downloadTranscriptButton/DownloadTranscriptButton';
import s from './style.module.less';
import { CopyVideoLinkButton } from './CopyVideoLinkButton';
import { CopyVideoIdButton } from './CopyVideoIdButton';

interface VideoCardButtonsProps {
  video: Video;
  onAddToCart?: () => void;
  onAddToPlaylist?: () => void;
  onUrlCopied?: () => void;
  onCleanupAddToPlaylist?: (playlistId: string, cleanUp: () => void) => void;
  iconOnly?: boolean;
  additionalSecondaryButtons?: React.ReactElement;
}

export const VideoCardButtons = ({
  video,
  onAddToCart,
  onAddToPlaylist,
  onCleanupAddToPlaylist,
  onUrlCopied,
  iconOnly = false,
  additionalSecondaryButtons,
}: VideoCardButtonsProps) => {
  const trackCopyVideoLink = () => {
    if (onUrlCopied) {
      onUrlCopied();
    }
    AnalyticsFactory.hotjar().event(HotjarEvents.CopyLinkFromSearchResults);
  };

  const hasTranscript = video?.links?.transcript?.getOriginalLink();

  return (
    <div className={s.buttonsWrapper} key={`copy-${video.id}`}>
      <div className={s.iconOnlyButtons}>
        <AddToPlaylistButton
          videoId={video.id}
          onCleanup={onCleanupAddToPlaylist}
          onClick={onAddToPlaylist}
        />
        {hasTranscript && (
          <FeatureGate product={Product.CLASSROOM}>
            <DownloadTranscriptButton video={video} />
          </FeatureGate>
        )}
        <FeatureGate feature="BO_WEB_APP_COPY_VIDEO_ID_BUTTON">
          <CopyVideoIdButton video={video} />
        </FeatureGate>
        <FeatureGate product={Product.LIBRARY}>
          <CopyVideoLinkButton video={video} onClick={trackCopyVideoLink} />
        </FeatureGate>
        {additionalSecondaryButtons}
      </div>

      <FeatureGate product={Product.LIBRARY}>
        {video.links.createEmbedCode ? (
          <EmbedButton video={video} iconOnly={iconOnly} />
        ) : (
          <FeatureGate linkName="cart">
            <AddToCartButton
              video={video}
              key="cart-button"
              width="148px"
              onClick={onAddToCart}
              iconOnly={iconOnly}
            />
          </FeatureGate>
        )}
      </FeatureGate>
      <FeatureGate product={Product.CLASSROOM}>
        <VideoShareCodeButton iconOnly={iconOnly} video={video} />
      </FeatureGate>
    </div>
  );
};
