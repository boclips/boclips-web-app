import React, { useState } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Constants } from 'src/AppConstants';
import RegistrationForm from 'src/components/registration/RegistrationForm';
import EmailVerificationPrompt from 'src/components/registration/EmailVerificationPrompt';

const CAPTCHA_TOKEN = Constants.CAPTCHA_TOKEN;

export const RegistrationProcess = () => {
  const [trialUserCreated, setTrialUserCreated] = useState<{
    accountName: string;
    userEmail: string;
  }>();

  const isRegistrationFinished = trialUserCreated;

  return (
    <GoogleReCaptchaProvider reCaptchaKey={CAPTCHA_TOKEN}>
      {!isRegistrationFinished ? (
        <RegistrationForm
          onRegistrationFinished={(accountName, userEmail) =>
            setTrialUserCreated({ accountName, userEmail })
          }
        />
      ) : (
        <EmailVerificationPrompt
          accountName={trialUserCreated.accountName}
          userEmail={trialUserCreated.userEmail}
        />
      )}
    </GoogleReCaptchaProvider>
  );
};
