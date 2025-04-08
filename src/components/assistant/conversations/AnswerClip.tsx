import React from 'react';
import { Clip } from 'boclips-api-client/dist/sub-clients/chat/model/Clip';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import Thumbnail from 'src/components/playlists/thumbnails/Thumbnail';
import { MoreActionsButton } from 'src/components/assistant/conversations/MoreActionsButton';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import s from './style.module.less';

interface Props {
  clip: Clip;
  id: string;
}

export const AnswerClip = ({ clip, id }: Props) => {
  const { data: video, isLoading } = useFindOrGetVideo(clip.videoId);

  const jumpToSectionWithId = (sectionId: string) => {
    document.querySelector(`#${sectionId}`).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  };

  return !isLoading ? (
    <div className={s.answer}>
      <div className={s.clipDetails}>
        <Thumbnail video={video} className={s.thumbnail} />
        <button
          onClick={() => {
            AnalyticsFactory.pendo().trackAssistantSidebarClipJumpedTo(
              clip.clipId,
            );
            jumpToSectionWithId(id);
          }}
          className={s.answerClip}
          type="button"
        >
          {clip.clipName}
        </button>
      </div>
      <div className={s.more}>
        <MoreActionsButton clip={clip} video={video} />
      </div>
    </div>
  ) : null;
};
