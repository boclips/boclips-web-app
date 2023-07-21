import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { useQueries } from '@tanstack/react-query';
import { BoclipsClient } from 'boclips-api-client';

const doGetLearningOutcomes = (client: BoclipsClient, videoId: string) => {
  return client.videoAIMetadata
    .getLearningOutcomes(videoId)
    .then((result) => result.learningOutcomes)
    .catch(() => null);
};

const doGetAssessmentQuestions = (client: BoclipsClient, videoId: string) => {
  return client.videoAIMetadata
    .getAssessmentQuestions(videoId)
    .then((result) => result.assessmentQuestions)
    .catch(() => null);
};

export const useGetVideoAIMetadata = (videoId: string) => {
  const client = useBoclipsClient();
  const [learningOutcomes, assessmentQuestions] = useQueries({
    queries: [
      {
        queryKey: ['learningOutcomes', videoId],
        queryFn: () => doGetLearningOutcomes(client, videoId),
      },

      {
        queryKey: ['assessmentQuestions', videoId],
        queryFn: () => doGetAssessmentQuestions(client, videoId),
      },
    ],
  });

  return [learningOutcomes, assessmentQuestions];
};
