import React from 'react';
import { Clip } from 'boclips-api-client/dist/sub-clients/chat/model/Clip';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import Thumbnail from 'src/components/playlists/thumbnails/Thumbnail';
import s from './style.module.less';

interface Props {
  clip: Clip;
}

export const AnswerClip = ({ clip }: Props) => {
  const { data: video, isLoading } = useFindOrGetVideo(clip.videoId);

  return !isLoading ? (
    <div className={s.answer}>
      <Thumbnail video={video} className={s.thumbnail} />
      <p>{clip.clipName}</p>
    </div>
  ) : null;
};
