import { useGetVideoAIMetadata } from 'src/hooks/api/videoAIMetadataQuery';
import React from 'react';
import { VideoAIMetadata } from 'src/components/videoPage/videoAIMetadata/VideoAIMetadata';
import { VideoAIMetadataType } from 'src/components/videoPage/videoAIMetadata/VideoAIMetadataType';
import { Typography } from '@boclips-ui/typography';
import { Video } from 'boclips-api-client/dist/types';
import { FeatureGate } from 'src/components/common/FeatureGate';
import s from './videoAIMetadata.module.less';

interface Props {
  video: Video;
}

export const VideoDescriptionAndAIMetadataWrapper = ({ video }: Props) => {
  const [
    { data: learningOutcomes, isLoading: isLearningOutcomesLoading },
    { data: assessmentQuestions, isLoading: isAssessmentQuestionsLoading },
  ] = useGetVideoAIMetadata(video?.id);

  return (
    <div data-qa="video-ai-metadata-wrapper" className={s.videoAIMetadata}>
      {video.description.trim() && (
        <section className={s.scrollableDescription}>
          <Typography.Title1>Video Description</Typography.Title1>
          <Typography.Body as="p" size="small" className="text-gray-800">
            {video.description}
          </Typography.Body>

          <Typography.Body className="lg:mt-4 text-gray-800">
            {video.additionalDescription}
          </Typography.Body>
        </section>
      )}

      <FeatureGate feature="BO_WEB_APP_DEV">
        {video && video.type === 'INSTRUCTIONAL' && (
          <>
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
          </>
        )}
      </FeatureGate>
    </div>
  );
};
