import React, { useState } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Constants } from 'src/AppConstants';
import RegistrationForm from 'src/components/registration/RegistrationForm';
import EmailVerificationPrompt from 'src/components/registration/EmailVerificationPrompt';
import TrialInfo from 'src/components/registration/trialInfo/TrialInfo';

const CAPTCHA_TOKEN = Constants.CAPTCHA_TOKEN;

export const RegistrationProcess = () => {
  const [userEmailCreated, setUserEmailCreated] = useState<string>();

  const isRegistrationFinished = userEmailCreated;

  return (
    <GoogleReCaptchaProvider reCaptchaKey={CAPTCHA_TOKEN}>
      {!isRegistrationFinished ? (
        <>
          <TrialInfo />
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
