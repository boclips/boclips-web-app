import { useGetVideoAIMetadata } from 'src/hooks/api/videoAIMetadataQuery';
import React from 'react';
import { VideoAIMetadata } from 'src/components/videoPage/videoAIMetadata/VideoAIMetadata';
import { VideoAIMetadataType } from 'src/components/videoPage/videoAIMetadata/VideoAIMetadataType';
import s from './videoAIMetadata.module.less';

interface Props {
  videoId: string;
}

export const VideoAIMetadataWrapper = ({ videoId }: Props) => {
  const [
    { data: learningOutcomes = null, isLoading: isLearningOutcomesLoading },
    {
      data: assessmentQuestions = null,
      isLoading: isAssessmentQuestionsLoading,
    },
  ] = useGetVideoAIMetadata(videoId);

  return (
    <div className={s.videoAIMetadata}>
      <VideoAIMetadata
        isLoading={isLearningOutcomesLoading}
        metadata={learningOutcomes}
        type={VideoAIMetadataType.LEARNING_OUTCOMES}
      />
      <VideoAIMetadata
        isLoading={isAssessmentQuestionsLoading}
        metadata={assessmentQuestions}
        type={VideoAIMetadataType.ASSESSMENT_QUESTIONS}
      />
    </div>
  );
};
