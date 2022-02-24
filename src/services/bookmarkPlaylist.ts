import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { CollectionsClient } from 'boclips-api-client/dist/sub-clients/collections/client/CollectionsClient';

export class BookmarkPlaylist {
  private client: CollectionsClient;

  public constructor(client: CollectionsClient) {
    this.client = client;
  }

  private static canBeBookmarked(collection: Collection): boolean {
    return !!collection.links.bookmark;
  }

  public async bookmark(collection: Collection): Promise<void> {
    if (collection.mine) {
      return;
    }

    if (!BookmarkPlaylist.canBeBookmarked(collection)) {
      return;
    }

    await this.client.bookmark(collection);
  }
}
