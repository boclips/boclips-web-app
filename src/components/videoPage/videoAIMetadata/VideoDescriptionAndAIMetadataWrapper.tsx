import { useGetVideoAIMetadata } from 'src/hooks/api/videoAIMetadataQuery';
import React from 'react';
import { VideoAIMetadata } from 'src/components/videoPage/videoAIMetadata/VideoAIMetadata';
import { VideoAIMetadataType } from 'src/components/videoPage/videoAIMetadata/VideoAIMetadataType';
import { Typography } from '@boclips-ui/typography';
import { Video } from 'boclips-api-client/dist/types';
import c from 'classnames';
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
    <>
      {video.description.trim() && (
        <section className={c(s.scrollableDescription, s.descriptionSection)}>
          <Typography.H1 size="xs" weight="medium" className="text-gray-900">
            Video Description
          </Typography.H1>
          <Typography.Body as="p" size="small" className="text-gray-800">
            {video.description}
          </Typography.Body>

          <Typography.Body className="lg:mt-4 text-gray-800">
            {video.additionalDescription}
          </Typography.Body>
        </section>
      )}

      {video && video.type === 'INSTRUCTIONAL' && (
        <>
          <section className={c(s.videoAIContent, s.learningOutcomesSection)}>
            <VideoAIMetadata
              isLoading={isLearningOutcomesLoading}
              metadata={learningOutcomes}
              type={VideoAIMetadataType.LEARNING_OUTCOMES}
            />
          </section>
          <section
            className={c(s.videoAIContent, s.assessmentQuestionsSection)}
          >
            <VideoAIMetadata
              isLoading={isAssessmentQuestionsLoading}
              metadata={assessmentQuestions}
              type={VideoAIMetadataType.ASSESSMENT_QUESTIONS}
            />
          </section>
        </>
      )}
    </>
  );
};
