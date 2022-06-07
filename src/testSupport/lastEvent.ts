import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { EventRequest } from 'boclips-api-client/dist/sub-clients/events/model/EventRequest';

export function lastEvent(
  client: FakeBoclipsClient,
  type?: string,
): EventRequest {
  return client.events
    .getEvents()
    .filter((event) => !type || event.type === type)
    .pop();
}
