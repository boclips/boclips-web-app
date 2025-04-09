import React from 'react';
import Feedback from 'src/components/assistant/feedback/Feedback';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { Clip } from 'boclips-api-client/dist/sub-clients/chat/model/Clip';
import Open from 'src/resources/icons/open-new-window.svg';
import formatDuration from 'src/components/playlists/buttons/playlistBookmark/helpers/formatDuration';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import Thumbnail from 'src/components/playlists/thumbnails/Thumbnail';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { EmbedButton } from 'src/components/embedButton/EmbedButton';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import { VideoShareLinkButton } from 'src/components/shareLinkButton/VideoShareLinkButton';
import { HighlightIcon } from 'src/components/assistant/common/HighlightIcon';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import s from './style.module.less';

interface Props {
  clip: Clip;
}

const HighlightPlayer = ({ clip }: Props) => {
  const breakpoints = useMediaBreakPoint();
  const isMobileView =
    breakpoints.type === 'mobile' || breakpoints.type === 'tablet';

  const { data: video, isLoading: isVideoLoading } = useFindOrGetVideo(
    clip.videoId,
  );

  return (
    <div className={s.playerWrapper}>
      <div className={s.header}>
        <div className={s.title}>
          <HighlightIcon />
          Highlight
        </div>
        <div className={s.durationBadge}>
          {formatDuration(clip.clipDuration)}
        </div>
      </div>
      {!isVideoLoading && (
        <div>
          <VideoPlayer
            video={video}
            segment={{ start: clip.startTime, end: clip.endTime }}
          />
          <div className={s.clipDetails}>
            <h1 className={s.clipTitle}>{clip.clipName}</h1>
            <p className={s.channelName}>{video.createdBy}</p>
          </div>
          <div className={s.buttonWrapper}>
            <div className={s.actionButtons}>
              <AddToPlaylistButton
                videoId={clip.videoId}
                highlightId={clip.clipId}
                iconOnly={isMobileView}
                outlineType={false}
              />
              <FeatureGate product={Product.CLASSROOM}>
                <VideoShareLinkButton
                  iconOnly={isMobileView}
                  video={video}
                  initialSegment={{
                    start: clip.startTime,
                    end: clip.endTime,
                  }}
                  onClick={() =>
                    AnalyticsFactory.pendo().trackAssistantHighlightShared(
                      clip.clipId,
                      video.id,
                    )
                  }
                />
              </FeatureGate>
              {video?.links?.createEmbedCode && (
                <EmbedButton
                  video={video}
                  initialSegment={{ start: clip.startTime, end: clip.endTime }}
                  iconOnly={isMobileView}
                  label="Embed"
                  width="auto"
                  onClick={() =>
                    AnalyticsFactory.pendo().trackAssistantHighlightEmbedded(
                      clip.clipId,
                      video.id,
                    )
                  }
                />
              )}
            </div>
            <Feedback clipId={clip.clipId} />
          </div>
          <div className={s.videoDetails}>
            <p>Highlight taken from:</p>
            <a
              href={`/videos/${video.id}`}
              target="new"
              rel="noopener noreferrer"
              onClick={() =>
                AnalyticsFactory.pendo().trackAssistantVideoNavigatedTo(
                  clip.clipId,
                  video.id,
                )
              }
            >
              <Thumbnail video={video} className={s.thumbnail} />
              {video.title}
              <Open />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default HighlightPlayer;
