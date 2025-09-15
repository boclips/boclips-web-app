import { shouldShowWelcomeModal } from 'src/hooks/useShowTrialWelcomeModal';

describe('should show trial welcome modal', () => {
  it('shows modal when CLASSROOM user has marketing info missing', () => {
    const isClassroomUser = true;
    const isUserInTrial = false;
    const isMarketingInfoMissingForUser = true;
    const isStudent = false;

    expect(
      shouldShowWelcomeModal(
        isClassroomUser,
        isUserInTrial,
        isMarketingInfoMissingForUser,
        isStudent,
      ),
    ).toBeTruthy();
  });

  it('does not show modal when CLASSROOM user has marketing info filled out', () => {
    const isClassroomUser = true;
    const isUserInTrial = false;
    const isMarketingInfoMissingForUser = false;
    const isStudent = false;

    expect(
      shouldShowWelcomeModal(
        isClassroomUser,
        isUserInTrial,
        isMarketingInfoMissingForUser,
        isStudent,
      ),
    ).toBeFalsy();
  });

  it('shows modal when non-classroom user in trial and has marketing info missing', () => {
    const isClassroomUser = false;
    const isUserInTrial = true;
    const isMarketingInfoMissingForUser = true;
    const isStudent = false;

    expect(
      shouldShowWelcomeModal(
        isClassroomUser,
        isUserInTrial,
        isMarketingInfoMissingForUser,
        isStudent,
      ),
    ).toBeTruthy();
  });

  it('does not show modal when non-classroom user in trial and has marketing info filled out', () => {
    const isClassroomUser = false;
    const isUserInTrial = true;
    const isMarketingInfoMissingForUser = false;
    const isStudent = false;

    expect(
      shouldShowWelcomeModal(
        isClassroomUser,
        isUserInTrial,
        isMarketingInfoMissingForUser,
        isStudent,
      ),
    ).toBeFalsy();
  });

  it('does not show modal when non-classroom user not in trial but missing marketing info', () => {
    // real-life example would be an account created before trial type&marketing info existed
    const isClassroomUser = false;
    const isUserInTrial = false;
    const isMarketingInfoMissingForUser = false;
    const isStudent = false;

    expect(
      shouldShowWelcomeModal(
        isClassroomUser,
        isUserInTrial,
        isMarketingInfoMissingForUser,
        isStudent,
      ),
    ).toBeFalsy();
  });

  it('does not show modal when CLASSROOM user has marketing info missing but is student', () => {
    const isClassroomUser = true;
    const isUserInTrial = false;
    const isMarketingInfoMissingForUser = true;
    const isStudent = true;

    expect(
      shouldShowWelcomeModal(
        isClassroomUser,
        isUserInTrial,
        isMarketingInfoMissingForUser,
        isStudent,
      ),
    ).toBeFalsy();
  });
});
