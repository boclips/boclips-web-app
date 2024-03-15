import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { ApiEventsClient } from 'boclips-api-client/dist/sub-clients/events/client/ApiEventsClient';
import { EventsClient } from 'boclips-api-client/dist/sub-clients/events/client/EventsClient';

export const usePlatformInteractedWithEvent = (): EventsClient => {
  const client = useBoclipsClient();
  console.log('links are ', client.links);
  return client.events;
};
