import React from 'react';
import { Video } from 'boclips-api-client/dist/types';
import LearningOutcomesAiMetadata from 'src/components/videoPage/videoMetadata/ai/LearningOutcomesAiMetadata';
import AssessmentQuestionsAiMetadata from 'src/components/videoPage/videoMetadata/ai/AssessmentQuestionsAiMetadata';

interface Props {
  video: Video;
}

const VideoAiMetadata = ({ video }: Props) => {
  return (
    <>
      {video && video.type === 'INSTRUCTIONAL' && (
        <>
          <LearningOutcomesAiMetadata video={video} />
          <AssessmentQuestionsAiMetadata video={video} />
        </>
      )}
    </>
  );
};

export default VideoAiMetadata;
