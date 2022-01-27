import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { Link } from 'boclips-api-client/dist/sub-clients/common/model/LinkEntity';

export class CollectionFactory {
  static sample(collection: Partial<Collection>): Collection {
    return {
      id: '1',
      owner: 'owner',
      title: 'title',
      videos: [],
      updatedAt: new Date(),
      discoverable: true,
      mine: true,
      createdBy: 'user',
      subjects: [],
      ageRange: null,
      links: {
        self: new Link({
          href: 'https://api.boclips.com/v1/collections/1',
        }),
      },
      ...collection,
    };
  }
}
