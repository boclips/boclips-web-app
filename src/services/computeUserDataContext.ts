import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { User } from 'boclips-api-client/dist/sub-clients/users/model/User';

interface ComputeUserDataContextProps {
  isUserInTrial: boolean;
  isAdmin: boolean;
  isClassroomUser: boolean;
  isMarketingInfoMissingForUser: boolean;
}
const computeUserDataContext = (user: User): ComputeUserDataContextProps => {
  const isUserInTrial = user?.account?.type === AccountType.TRIAL;
  const isMarketingInfoSetForAccount =
    user?.account && isAccountMarketingInfoSet(user);
  const isClassroomUser =
    user?.account &&
    user?.account?.products?.some((product) => product === Product.CLASSROOM);

  const isMarketingInfoSetForUser = user && isMarketingInfoSet(user);
  const isMarketingInfoMissingForUser = !isMarketingInfoSetForUser;

  const isAdmin = !isMarketingInfoSetForAccount;
  return {
    isUserInTrial,
    isAdmin,
    isClassroomUser,
    isMarketingInfoMissingForUser,
  };
};

const isMarketingInfoSet = (user: User): boolean => {
  const isJobTitleSet = user.jobTitle?.trim().length > 0;
  const isAudienceSet = user.audiences?.length > 0;
  const isDesiredContentSet = user.desiredContent?.trim().length > 0;

  return isJobTitleSet && isAudienceSet && isDesiredContentSet;
};

const isAccountMarketingInfoSet = (user: User): boolean => {
  return user?.account?.marketingInformation?.companySegments?.length > 0;
};

export default computeUserDataContext;
