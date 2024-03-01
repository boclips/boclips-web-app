import { useGetVideoAIMetadata } from 'src/hooks/api/videoAIMetadataQuery';
import React from 'react';
import { VideoAIMetadata } from 'src/components/videoPage/videoMetadata/types/VideoAIMetadata';
import { Video } from 'boclips-api-client/dist/types';
import c from 'classnames';
import AiMetadata from 'src/components/videoPage/videoMetadata/ai/AiMetadata';
import s from '../style.module.less';

interface Props {
  video: Video;
}

const VideoAiMetadata = ({ video }: Props) => {
  const [
    { data: learningOutcomes, isLoading: isLearningOutcomesLoading },
    { data: assessmentQuestions, isLoading: isAssessmentQuestionsLoading },
  ] = useGetVideoAIMetadata(video?.id);

  return (
    <>
      {video && video.type === 'INSTRUCTIONAL' && (
        <>
          <section className={c(s.videoAIContent, s.learningOutcomesSection)}>
            <AiMetadata
              isLoading={isLearningOutcomesLoading}
              metadata={learningOutcomes}
              type={VideoAIMetadata.LEARNING_OUTCOMES}
            />
          </section>
          <section
            className={c(s.videoAIContent, s.assessmentQuestionsSection)}
          >
            <AiMetadata
              isLoading={isAssessmentQuestionsLoading}
              metadata={assessmentQuestions}
              type={VideoAIMetadata.ASSESSMENT_QUESTIONS}
            />
          </section>
        </>
      )}
    </>
  );
};

export default VideoAiMetadata;
