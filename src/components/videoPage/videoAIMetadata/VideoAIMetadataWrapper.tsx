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
    { data: learningOutcomes, isLoading: isLearningOutcomesLoading },
    { data: assessmentQuestions, isLoading: isAssessmentQuestionsLoading },
  ] = useGetVideoAIMetadata(videoId);

  return (
    <div data-qa="video-ai-metadata-wrapper" className={s.videoAIMetadata}>
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
