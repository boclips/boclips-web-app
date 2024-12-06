import React from 'react';
import { VideoAIMetadata } from '@components/videoPage/videoMetadata/types/VideoAIMetadata';
import c from 'classnames';
import { useGetVideoAssessmentQuestions } from '@src/hooks/api/videoAIMetadataQuery';
import { Video } from 'boclips-api-client/dist/types';
import AiMetadata from '@components/videoPage/videoMetadata/ai/AiMetadata';
import { FeatureGate } from '@components/common/FeatureGate';
import s from '../style.module.less';

interface Props {
  video: Video;
}

const AssessmentQuestionsAiMetadata = ({ video }: Props) => {
  const { data: assessmentQuestions, isLoading: isAssessmentQuestionsLoading } =
    useGetVideoAssessmentQuestions(video?.id);
  return (
    <FeatureGate linkName="assessmentQuestions">
      <section className={c(s.videoAIContent, s.assessmentQuestionsSection)}>
        <AiMetadata
          isLoading={isAssessmentQuestionsLoading}
          metadata={assessmentQuestions}
          type={VideoAIMetadata.ASSESSMENT_QUESTIONS}
        />
      </section>
    </FeatureGate>
  );
};

export default AssessmentQuestionsAiMetadata;
