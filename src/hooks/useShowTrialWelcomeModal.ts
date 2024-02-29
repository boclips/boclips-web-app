import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

interface Props {
  showPopup: (arg: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setIsClassroomUser: (isClassroomUser: boolean) => void;
}

const useShowTrialWelcomeModal = ({
  showPopup,
  setIsAdmin,
  setIsClassroomUser,
}: Props) => {
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useGetUserQuery();
  useEffect(() => {
    if (userLoading) {
      return;
    }
    const isUserInTrial = user?.account?.type === AccountType.TRIAL;
    const isMarketingInfoSetForUser = user && isMarketingInfoSet(user);
    const isMarketingInfoSetForAccount =
      user?.account && isAccountMarketingInfoSet(user);
    const isClassroomUser =
      user?.account &&
      user?.account?.products?.some((product) => product === Product.CLASSROOM);

    if (isUserInTrial && !isMarketingInfoSetForUser) {
      showPopup(true);
      setIsAdmin(!isMarketingInfoSetForAccount);
      setIsClassroomUser(isClassroomUser);
    }
  }, [user, userLoading, navigate, showPopup, setIsAdmin, setIsClassroomUser]);
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

export default useShowTrialWelcomeModal;
