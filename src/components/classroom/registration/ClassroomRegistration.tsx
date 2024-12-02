import React, { useState } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Constants } from '@src/AppConstants';
import ClassroomRegistrationForm from '@src/components/classroom/registration/registrationForm/ClassroomRegistrationForm';
import ClassroomEmailVerificationPrompt from '@src/components/classroom/registration/ClassroomEmailVerificationPrompt';
import ClassroomInfo from '@src/components/classroom/registration/classroomInfo/ClassroomInfo';
import { useMediaBreakPoint } from 'boclips-ui';
import ClassroomLoginPrompt from '@src/components/classroom/registration/ClassroomLoginPrompt';

const CAPTCHA_TOKEN = Constants.CAPTCHA_TOKEN;

export const ClassroomRegistration = () => {
  const breakpoints = useMediaBreakPoint();
  const isMobileView =
    breakpoints.type === 'mobile' || breakpoints.type === 'tablet';
  const [userEmailCreated, setUserEmailCreated] = useState<string>();

  return (
    <GoogleReCaptchaProvider reCaptchaKey={CAPTCHA_TOKEN}>
      {!userEmailCreated ? (
        <>
          {!isMobileView && <ClassroomInfo />}
          <ClassroomRegistrationForm
            onRegistrationFinished={(userEmail) =>
              setUserEmailCreated(userEmail)
            }
          />
        </>
      ) : Constants.REGISTRATION_CLASSROOM_REQUIRE_EMAIL_VERIFICATION ? (
        <ClassroomEmailVerificationPrompt userEmail={userEmailCreated} />
      ) : (
        <ClassroomLoginPrompt />
      )}
    </GoogleReCaptchaProvider>
  );
};
