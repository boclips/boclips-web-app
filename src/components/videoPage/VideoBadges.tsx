import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { SubjectBadge, EducationLevelBadge } from 'boclips-ui';
import React from 'react';
import s from './style.module.less';

interface Props {
  video: Video;
}

export const VideoBadges = ({ video }: Props) => {
  return (
    <section className={s.badges}>
      {video?.subjects?.map((subject) => (
        <SubjectBadge key={subject.id} subject={subject} />
      ))}

      {video?.educationLevels?.map((level) => (
        <EducationLevelBadge key={level.code} educationLevel={level} />
      ))}
    </section>
  );
};
