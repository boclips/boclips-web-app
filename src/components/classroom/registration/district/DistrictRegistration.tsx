import React, { useState } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Constants } from 'src/AppConstants';
import DistrictRegistrationForm from 'src/components/classroom/registration/district/registrationForm/DistrictRegistrationForm';
import DistrictEmailVerificationPrompt from 'src/components/classroom/registration/district/DistrictEmailVerificationPrompt';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import DistrictLoginPrompt from 'src/components/classroom/registration/district/DistrictLoginPrompt';
import ClassroomInfo from 'src/components/classroom/registration/common/classroomInfo/ClassroomInfo';

const CAPTCHA_TOKEN = Constants.CAPTCHA_TOKEN;

export const DistrictRegistration = () => {
  const breakpoints = useMediaBreakPoint();
  const isMobileView =
    breakpoints.type === 'mobile' || breakpoints.type === 'tablet';
  const [userEmailCreated, setUserEmailCreated] = useState<string>();

  return (
    <GoogleReCaptchaProvider reCaptchaKey={CAPTCHA_TOKEN}>
      {!userEmailCreated ? (
        <>
          {!isMobileView && <ClassroomInfo />}
          <DistrictRegistrationForm
            onRegistrationFinished={(userEmail) =>
              setUserEmailCreated(userEmail)
            }
          />
        </>
      ) : Constants.REGISTRATION_CLASSROOM_REQUIRE_EMAIL_VERIFICATION ? (
        <DistrictEmailVerificationPrompt userEmail={userEmailCreated} />
      ) : (
        <DistrictLoginPrompt />
      )}
    </GoogleReCaptchaProvider>
  );
};
