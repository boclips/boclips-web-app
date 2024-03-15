import { useMutation } from '@tanstack/react-query';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';

export const usePlatformInteractedWithEvent = () => {
  const client = useBoclipsClient();
  return useMutation(
    ({ subtype, anonymous }: { subtype: string; anonymous: boolean }) =>
      client.events.trackPlatformInteraction(subtype, anonymous),
  );
};
