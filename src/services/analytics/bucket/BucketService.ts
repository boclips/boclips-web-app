import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import { Bucket } from 'src/services/analytics/bucket/Bucket';

type BucketEvent = 'search_topic_selected';

export default class BucketService {
  private readonly bucket: Bucket | null;

  private userId?: string;

  public constructor(bucket?: Bucket) {
    this.bucket = bucket;
  }

  public setUserData(user: User): void {
    if (!this.bucket) {
      return;
    }

    this.bucket.user(user.id, { name: `${user.firstName} ${user.lastName}` });
    this.bucket.company(
      user.organisation.id,
      { name: user.organisation.name },
      user.id,
    );
    this.userId = user.id;
  }

  public track(
    eventName: BucketEvent,
    properties?: { [index: string]: any },
  ): void {
    if (!this.bucket) {
      return;
    }

    this.bucket?.track(eventName, properties, this.userId);
  }
}
