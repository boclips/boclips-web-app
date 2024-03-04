import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import computeUserDataContext from 'src/services/computeUserDataContext';

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
    );

    if (shouldShowPopup) {
      showPopup(true);
      setIsAdmin(isAdmin);
      setIsClassroomUser(isClassroomUser);
    }
  }, [user, userLoading, navigate, showPopup, setIsAdmin, setIsClassroomUser]);
};

export const shouldShowWelcomeModal = (
  isClassroomUser,
  isUserInTrial,
  isMarketingInfoMissingForUser,
) => {
  return (isClassroomUser || isUserInTrial) && isMarketingInfoMissingForUser;
};
export default useShowTrialWelcomeModal;
