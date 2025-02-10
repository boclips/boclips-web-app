import React from 'react';
import Feedback from 'src/components/assistant/feedback/Feedback';
import { Link } from 'boclips-api-client/dist/sub-clients/common/model/LinkEntity';
import expandUrlTemplate from 'boclips-api-client/dist/sub-clients/common/utils/expandUrlTemplate';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { Clip } from 'boclips-api-client/dist/sub-clients/chat/model/Clip';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
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
import s from './style.module.less';

interface Props {
  clip: Clip;
}

const HighlightPlayer = ({ clip }: Props) => {
  const client = useBoclipsClient();
  const breakpoints = useMediaBreakPoint();
  const isMobileView =
    breakpoints.type === 'mobile' || breakpoints.type === 'tablet';

  const videoLink = client.links.video;
  const { data: video, isLoading: isVideoLoading } = useFindOrGetVideo(
    clip.videoId,
  );

  return (
    <div className={s.playerWrapper}>
      <div className={s.header}>
        <p>
          <HighlightIcon />
          Highlight
        </p>
        <div className={s.durationBadge}>
          {formatDuration(clip.clipDuration)}
        </div>
      </div>
      <VideoPlayer
        videoLink={
          new Link({
            href: expandUrlTemplate(videoLink.href, {
              id: clip.videoId,
            }),
            templated: false,
          })
        }
        segment={{ start: clip.startTime, end: clip.endTime }}
      />
      <div className={s.clipDetails}>
        <h1 className={s.clipTitle}>{clip.clipName}</h1>
        {!isVideoLoading && <p className={s.channelName}>{video.createdBy}</p>}
      </div>
      <div className={s.buttonWrapper}>
        <div className={s.actionButtons}>
          <AddToPlaylistButton
            videoId={clip.videoId}
            highlightId={clip.clipId}
            iconOnly={isMobileView}
            outlineType={false}
          />
          {!isVideoLoading && (
            <FeatureGate product={Product.CLASSROOM}>
              <VideoShareLinkButton
                iconOnly={isMobileView}
                video={video}
                initialSegment={{ start: clip.startTime, end: clip.endTime }}
              />
            </FeatureGate>
          )}
          {!isVideoLoading && video?.links?.createEmbedCode && (
            <EmbedButton
              video={video}
              initialSegment={{ start: clip.startTime, end: clip.endTime }}
              iconOnly={isMobileView}
              label="Embed"
              width="auto"
            />
          )}
        </div>
        <Feedback clipId={clip.clipId} />
      </div>
      {!isVideoLoading && (
        <div className={s.videoDetails}>
          <p>Highlight taken from:</p>
          <a
            href={`/videos/${video.id}`}
            target="new"
            rel="noopener noreferrer"
          >
            <Thumbnail video={video} className={s.thumbnail} />
            {video.title}
            <Open />
          </a>
        </div>
      )}
    </div>
  );
};

export default HighlightPlayer;
