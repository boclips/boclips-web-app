import React, { useState } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Constants } from 'src/AppConstants';
import RegistrationForm from 'src/components/classroom/registration/registrationForm/ClassroomRegistrationForm';
import ClassroomEmailVerificationPrompt from 'src/components/classroom/registration/ClassroomEmailVerificationPrompt';
import TrialInfo from 'src/components/classroom/registration/trialInfo/TrialInfo';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';

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
          {!isMobileView && <TrialInfo />}
          <RegistrationForm
            onRegistrationFinished={(userEmail) =>
              setUserEmailCreated(userEmail)
            }
          />
        </>
      ) : (
        <ClassroomEmailVerificationPrompt userEmail={userEmailCreated} />
      )}
    </GoogleReCaptchaProvider>
  );
};
