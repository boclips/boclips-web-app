import { useGetVideoAIMetadata } from 'src/hooks/api/videoAIMetadataQuery';
import React from 'react';
import { VideoAIMetadataContent } from 'src/components/videoPage/VideoAIMetadataContent';
import s from './style.module.less';

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
      <VideoAIMetadataContent
        isLoading={isLearningOutcomesLoading}
        metadata={learningOutcomes}
        type="Learning Outcomes"
      />
      <VideoAIMetadataContent
        isLoading={isAssessmentQuestionsLoading}
        metadata={assessmentQuestions}
        type="Assessment Questions"
      />
    </div>
  );
};
