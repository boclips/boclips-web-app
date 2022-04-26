import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';

export default class BaseEvent {
  public readonly userId: string;

  public readonly organisationId?: string;

  public readonly organisationName?: string;

  constructor(user: User) {
    this.userId = user.id;
    this.organisationId = user.organisation?.id;
    this.organisationName = user.organisation?.name;
  }
}
