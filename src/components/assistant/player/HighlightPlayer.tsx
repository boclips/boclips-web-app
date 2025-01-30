import React from 'react';
import Feedback from 'src/components/assistant/feedback/Feedback';
import { Link } from 'boclips-api-client/dist/sub-clients/common/model/LinkEntity';
import expandUrlTemplate from 'boclips-api-client/dist/sub-clients/common/utils/expandUrlTemplate';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { Clip } from 'boclips-api-client/dist/sub-clients/chat/model/Clip';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import HighlightIcon from 'src/resources/icons/highlights.svg';
import Open from 'src/resources/icons/open-new-window.svg';
import formatDuration from 'src/components/playlists/buttons/playlistBookmark/helpers/formatDuration';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import Thumbnail from 'src/components/playlists/thumbnails/Thumbnail';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import s from './style.module.less';

interface Props {
  clip: Clip;
}

const HighlightPlayer = ({ clip }: Props) => {
  const videoLink = useBoclipsClient().links.video;
  const { data: video, isLoading: isVideoLoading } = useFindOrGetVideo(
    clip.videoId,
  );

  return (
    <div className={s.playerWrapper}>
      <div className={s.header}>
        <p>
          <div className={s.icon}>
            <HighlightIcon />
          </div>{' '}
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
      <h1 className={s.clipTitle}>{clip.clipName}</h1>
      <div className={s.buttonWrapper}>
        <div className={s.actionbuttons}>
          <AddToPlaylistButton
            videoId={clip.videoId}
            highlightId={clip.clipId}
          />
        </div>
        <Feedback clipId={clip.clipId} />
      </div>
      {!isVideoLoading ? (
        <div className={s.videoDetails}>
          <p>Highlight taken from:</p>
          <a
            href={`${window.location.host}/videos/${video.id}`}
            target="new"
            rel="noopener noreferrer"
          >
            <Thumbnail video={video} className={s.thumbnail} />
            {video.title}
            <Open />
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default HighlightPlayer;
