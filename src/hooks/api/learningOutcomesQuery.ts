import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { useQuery } from '@tanstack/react-query';
import { BoclipsClient } from 'boclips-api-client';

export const useGetLearningOutcomes = (videoId: string) => {
  const client = useBoclipsClient();
  return useQuery(['learningOutcomes', videoId], () =>
    doGetLearningOutcomes(client, videoId),
  );
};

const doGetLearningOutcomes = (client: BoclipsClient, videoId: string) => {
  return client.learningOutcomes
    .getByVideoId(videoId)
    .then((result) => result.learningOutcomes)
    .catch(() => null);
};
