import React, { useState } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Constants } from '@src/AppConstants';
import RegistrationForm from '@components/registration/registrationForm/RegistrationForm';
import EmailVerificationPrompt from '@components/registration/EmailVerificationPrompt';
import TrialInfo from '@components/registration/trialInfo/TrialInfo';
import { useMediaBreakPoint } from 'boclips-ui';

const CAPTCHA_TOKEN = Constants.CAPTCHA_TOKEN;

export const Registration = () => {
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
        <EmailVerificationPrompt userEmail={userEmailCreated} />
      )}
    </GoogleReCaptchaProvider>
  );
};
