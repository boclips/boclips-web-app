import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { Link } from 'boclips-api-client/dist/sub-clients/common/model/LinkEntity';

export class CollectionFactory {
  static sample(collection: Partial<Collection>): Collection {
    return {
      id: '1',
      owner: 'owner',
      ownerName: 'Owner Name',
      title: 'title',
      videos: [],
      updatedAt: new Date(),
      discoverable: true,
      mine: true,
      createdBy: 'user',
      subjects: [],
      ageRange: null,
      links: this.sampleLinks({}),
      ...collection,
    };
  }

  static sampleLinks(links: Partial<{ bookmark?: Link; unbookmark?: Link }>) {
    return {
      self: new Link({
        href: 'https://api.boclips.com/v1/collections/1',
      }),
      addVideo: new Link({
        href: 'https://api.boclips.com/v1/collections/1/videos/{video_id}',
      }),
      removeVideo: new Link({
        href: 'https://api.boclips.com/v1/collections/1/videos/{video_id}',
      }),
      bookmark: new Link({
        href: 'https://api.boclips.com/v1/collections/1?bookmarked=true',
      }),
      unbookmark: undefined,
      ...links,
    };
  }
}
