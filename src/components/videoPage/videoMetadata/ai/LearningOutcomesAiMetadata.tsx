import React from 'react';
import { VideoAIMetadata } from 'src/components/videoPage/videoMetadata/types/VideoAIMetadata';
import c from 'classnames';
import { useGetVideoLearningOutcomes } from 'src/hooks/api/videoAIMetadataQuery';
import { Video } from 'boclips-api-client/dist/types';
import AiMetadata from 'src/components/videoPage/videoMetadata/ai/AiMetadata';
import { FeatureGate } from 'src/components/common/FeatureGate';
import s from '../style.module.less';

interface Props {
  video: Video;
}

const LearningOutcomesAiMetadata = ({ video }: Props) => {
  const { data: learningOutcomes, isLoading: isLearningOutcomesLoading } =
    useGetVideoLearningOutcomes(video?.id);
  return (
    <FeatureGate linkName="learningOutcomes">
      <section className={c(s.videoAIContent, s.learningOutcomesSection)}>
        <AiMetadata
          isLoading={isLearningOutcomesLoading}
          metadata={learningOutcomes}
          type={VideoAIMetadata.LEARNING_OUTCOMES}
        />
      </section>
    </FeatureGate>
  );
};

export default LearningOutcomesAiMetadata;
