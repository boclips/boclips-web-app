import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import SubjectBadge from '@boclips-ui/subject-badge';
import EducationLevelBadge from '@boclips-ui/education-level-badge';
import React from 'react';
import s from './style.module.less';

interface Props {
  video: Video;
}

export const VideoDescription = ({ video }: Props) => {
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
