import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';

const enum Attributes {
  OrganisationId = 'organisation_id',
  OrganisationName = 'organisation_name',
}

export default class UserAttributes {
  private readonly user: User;

  constructor(user: User) {
    this.user = user;
  }

  public attributes(): object {
    const attributes = {};

    attributes[Attributes.OrganisationId] = this.user.organisation?.id || null;
    attributes[Attributes.OrganisationName] =
      this.user.organisation?.name || null;

    return attributes;
  }
}
