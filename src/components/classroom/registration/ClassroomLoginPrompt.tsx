import React from 'react';
import { Typography } from 'boclips-ui';
import ScrollToTop from '@src/hooks/scrollToTop';
import Confetti from '@components/confetti/Confetti';
import { Constants } from '@src/AppConstants';
import VerifyEmailIllustration from '@resources/icons/classroom-registration-verify-email-illustration.svg?react';
import s from './style.module.less';

const ClassroomEmailVerificationPrompt = () => {
  return (
    <>
      <main tabIndex={-1} className={s.emailVerificationPromptWrapper}>
        <ScrollToTop />
        <Typography.H2 className="mb-8">
          You&apos;re ready to start!
        </Typography.H2>
        <VerifyEmailIllustration />
        <Typography.Body className={s.message}>
          <p>
            Congratulations! You’ve successfully created your CLASSROOM account.
          </p>
          <p>
            You can{' '}
            <Typography.Link type="inline-blue">
              <a href={Constants.HOST}>login here</a>
            </Typography.Link>
            .
          </p>
          <p>
            If you need any support please{' '}
            <Typography.Link type="inline-gray">
              <a href="mailto:support@boclips.com">contact us</a>
            </Typography.Link>
            .
          </p>
        </Typography.Body>
      </main>
      <Confetti />
    </>
  );
};

export default ClassroomEmailVerificationPrompt;
