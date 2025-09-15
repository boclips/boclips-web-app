import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import computeUserDataContext from 'src/services/computeUserDataContext';
import { UserRole } from 'boclips-api-client/dist/sub-clients/users/model/UserRole';

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
    const {
      isUserInTrial,
      isClassroomUser,
      isMarketingInfoMissingForUser,
      isAdmin,
    } = computeUserDataContext(user);

    const shouldShowPopup = shouldShowWelcomeModal(
      isClassroomUser,
      isUserInTrial,
      isMarketingInfoMissingForUser,
      user.userRoles?.CLASSROOM === UserRole.STUDENT,
    );

    if (shouldShowPopup) {
      showPopup(true);
      setIsAdmin(isAdmin);
      setIsClassroomUser(isClassroomUser);
    }
  }, [user, userLoading, navigate, showPopup, setIsAdmin, setIsClassroomUser]);
};

export const shouldShowWelcomeModal = (
  isClassroomUser: boolean,
  isUserInTrial: boolean,
  isMarketingInfoMissingForUser: boolean,
  isStudent: boolean,
) => {
  return (
    (isClassroomUser || isUserInTrial) &&
    isMarketingInfoMissingForUser &&
    !isStudent
  );
};
export default useShowTrialWelcomeModal;
