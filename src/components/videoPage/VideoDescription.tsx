import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import SubjectBadge from '@boclips-ui/subject-badge';
import React from 'react';

import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

interface Props {
  video: Video;
}

export const VideoDescription = ({ video }: Props) => {
  return (
    <div className="lg:mt-4 flex flex-col">
      <div className={s.badges}>
        {video?.subjects?.map((subject) => (
          <SubjectBadge key={subject.id} subject={subject} />
        ))}
      </div>
      <div className="lg:mt-4">
        <Typography.Body className="text-gray-800">
          {video?.description}
        </Typography.Body>
      </div>
      <div className="lg:mt-4">
        <Typography.Body className="text-gray-800">
          {video?.additionalDescription}
        </Typography.Body>
      </div>
    </div>
  );
};
