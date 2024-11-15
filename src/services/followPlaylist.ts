import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { CollectionsClient } from 'boclips-api-client/dist/sub-clients/collections/client/CollectionsClient';
import { doFollowPlaylist } from '@src/hooks/api/playlistsQuery';

export class FollowPlaylist {
  private client: CollectionsClient;

  public constructor(client: CollectionsClient) {
    this.client = client;
  }

  private static canBeFollowed(collection: Collection): boolean {
    return !!collection.links.bookmark;
  }

  public async follow(collection: Collection): Promise<boolean> {
    if (collection.mine) {
      return false;
    }

    if (!FollowPlaylist.canBeFollowed(collection)) {
      return false;
    }

    return doFollowPlaylist(collection, this.client).then(() => true);
  }
}
