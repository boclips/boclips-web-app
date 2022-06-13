import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import SubjectBadge from '@boclips-ui/subject-badge';
import EducationLevelBadge from '@boclips-ui/education-level-badge';
import React from 'react';

import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

interface Props {
  video: Video;
}

export const VideoDescription = ({ video }: Props) => {
  return (
    <>
      <div className={s.badges}>
        {video?.subjects?.map((subject) => (
          <SubjectBadge key={subject.id} subject={subject} />
        ))}

        {video?.educationLevels?.map((level) => (
          <EducationLevelBadge key={level.code} educationLevel={level} />
        ))}
      </div>

      <Typography.Body className=" lg:mt-4 text-gray-800">
        {/* {video?.description} */}
        The White House's sudden moves in the Mideast sparked alarm from
        Congress on Wednesday as key Democrats warned President Donald Trump off
        war with Iran and lawmakers in both parties demanded more information on
        the administration's strategy. The White House's sudden moves in the
        Mideast sparked alarm from Congress on Wednesday as key Democrats warned
        President Donald Trump off war with Iran and lawmakers in both parties
        demanded more information on the administration's strategy. The White
        House's sudden moves in the Mideast sparked alarm from Congress on
        Wednesday as key Democrats warned President Donald Trump off war with
        Iran and lawmakers in both parties demanded more information on the
        administration's strategy. The White House's sudden moves in the Mideast
        sparked alarm from Congress on Wednesday as key Democrats warned
        President Donald Trump off war with Iran and lawmakers in both parties
        demanded more information on the administration's strategy.
      </Typography.Body>

      <Typography.Body className="lg:mt-4 text-gray-800">
        {/* {video?.additionalDescription} */}
        The White House's sudden moves in the Mideast sparked alarm from
        Congress on Wednesday as key Democrats warned President Donald Trump off
        war with Iran and lawmakers in both parties demanded more information on
        the administration's strategy. The White House's sudden moves in the
        Mideast sparked alarm from Congress on Wednesday as key Democrats warned
        President Donald Trump off war with Iran and lawmakers in both parties
        demanded more information on the administration's strategy. The White
        House's sudden moves in the Mideast sparked alarm from Congress on
        Wednesday as key Democrats warned President Donald Trump off war with
        Iran and lawmakers in both parties demanded more information on the
        administration's strategy.
      </Typography.Body>
    </>
  );
};
