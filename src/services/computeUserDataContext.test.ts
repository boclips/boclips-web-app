import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import computeUserDataContext from '@src/services/computeUserDataContext';

describe('compute user data context', () => {
  describe('isClassroomUser', () => {
    it('classroom user when Classroom product', () => {
      const user = UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          products: [Product.CLASSROOM],
        },
      });
      expect(computeUserDataContext(user).isClassroomUser).toBeTruthy();
    });

    it('not a classroom user when no classroom product', () => {
      const user = UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          products: [Product.LIBRARY],
        },
      });
      expect(computeUserDataContext(user).isClassroomUser).toBeFalsy();
    });
  });

  describe('isUserInTrial', () => {
    it('user in trial when account type is TRIAL', () => {
      const user = UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          type: AccountType.TRIAL,
        },
      });
      expect(computeUserDataContext(user).isUserInTrial).toBeTruthy();
    });

    it('user not in trial when account type is TRIAL', () => {
      const user = UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          type: AccountType.STANDARD,
        },
      });
      expect(computeUserDataContext(user).isUserInTrial).toBeFalsy();
    });
  });

  describe('isAdmin', () => {
    it('user is admin when empty account company segments', () => {
      const user = UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          marketingInformation: {
            companySegments: [],
          },
        },
      });
      expect(computeUserDataContext(user).isAdmin).toBeTruthy();
    });

    it('user is admin when nullable account company segments', () => {
      const user = UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          marketingInformation: {
            companySegments: null,
          },
        },
      });
      expect(computeUserDataContext(user).isAdmin).toBeTruthy();
    });

    it('user is not admin when account company segments exist', () => {
      const user = UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          marketingInformation: {
            companySegments: ['segments'],
          },
        },
      });
      expect(computeUserDataContext(user).isAdmin).toBeFalsy();
    });
  });

  describe('isMarketingInfoMissingForUser', () => {
    it('user marketing info NOT missing when all data is there', () => {
      const user = UserFactory.sample({
        audiences: ['audience'],
        desiredContent: 'desires',
        jobTitle: 'title',
      });
      expect(
        computeUserDataContext(user).isMarketingInfoMissingForUser,
      ).toBeFalsy();
    });

    it('user marketing info missing when empty job title', () => {
      const user = UserFactory.sample({
        audiences: ['audience'],
        desiredContent: 'desires',
        jobTitle: '',
      });
      expect(
        computeUserDataContext(user).isMarketingInfoMissingForUser,
      ).toBeTruthy();
    });

    it('user marketing info missing when nullable job title', () => {
      const user = UserFactory.sample({
        audiences: ['audience'],
        desiredContent: 'desires',
        jobTitle: null,
      });
      expect(
        computeUserDataContext(user).isMarketingInfoMissingForUser,
      ).toBeTruthy();
    });

    it('user marketing info missing when empty desired content', () => {
      const user = UserFactory.sample({
        audiences: ['audience'],
        desiredContent: '',
        jobTitle: 'title',
      });
      expect(
        computeUserDataContext(user).isMarketingInfoMissingForUser,
      ).toBeTruthy();
    });

    it('user marketing info missing when nullable desired content', () => {
      const user = UserFactory.sample({
        audiences: ['audience'],
        desiredContent: null,
        jobTitle: 'title',
      });
      expect(
        computeUserDataContext(user).isMarketingInfoMissingForUser,
      ).toBeTruthy();
    });

    it('user marketing info missing when empty audiences', () => {
      const user = UserFactory.sample({
        audiences: [],
        desiredContent: 'desires',
        jobTitle: 'title',
      });
      expect(
        computeUserDataContext(user).isMarketingInfoMissingForUser,
      ).toBeTruthy();
    });

    it('user marketing info missing when nullable audiences', () => {
      const user = UserFactory.sample({
        audiences: null,
        desiredContent: 'desires',
        jobTitle: 'title',
      });
      expect(
        computeUserDataContext(user).isMarketingInfoMissingForUser,
      ).toBeTruthy();
    });
  });
});
