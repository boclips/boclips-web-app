import React from 'react';
import { Video } from 'boclips-api-client/dist/types';
import LearningOutcomesAiMetadata from 'src/components/videoPage/videoMetadata/ai/LearningOutcomesAiMetadata';
import AssessmentQuestionsAiMetadata from 'src/components/videoPage/videoMetadata/ai/AssessmentQuestionsAiMetadata';
import { FeatureGate } from 'src/components/common/FeatureGate';

interface Props {
  video: Video;
}

const VideoAiMetadata = ({ video }: Props) => {
  return (
    <>
      {video && video.type === 'INSTRUCTIONAL' && (
        <>
          <FeatureGate linkName="learningOutcomes">
            <LearningOutcomesAiMetadata video={video} />
          </FeatureGate>
          <FeatureGate linkName="assessmentQuestions">
            <AssessmentQuestionsAiMetadata video={video} />
          </FeatureGate>
        </>
      )}
    </>
  );
};

export default VideoAiMetadata;
