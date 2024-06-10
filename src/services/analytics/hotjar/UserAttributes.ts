import { User } from 'boclips-api-client/dist/sub-clients/users/model/User';

const enum Attributes {
  AccountId = 'account_id',
  AccountName = 'account_name',
}

export default class UserAttributes {
  private readonly user: User;

  constructor(user: User) {
    this.user = user;
  }

  public attributes(): object {
    const attributes = {};

    attributes[Attributes.AccountId] = this.user.account?.id || null;
    attributes[Attributes.AccountName] = this.user.account?.name || null;

    return attributes;
  }
}
