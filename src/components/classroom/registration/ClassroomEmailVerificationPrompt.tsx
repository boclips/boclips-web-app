import React from 'react';
import { Typography } from 'boclips-ui';
import ScrollToTop from '@src/hooks/scrollToTop';
import Confetti from '@src/components/confetti/Confetti';
import s from './style.module.less';
import VerifyEmailIllustration from '../../../resources/icons/classroom-registration-verify-email-illustration.svg';

interface EmailVerificationPromptProps {
  userEmail: string;
}

const ClassroomEmailVerificationPrompt = ({
  userEmail,
}: EmailVerificationPromptProps) => {
  return (
    <>
      <main tabIndex={-1} className={s.emailVerificationPromptWrapper}>
        <ScrollToTop />
        <Typography.H2 className="mb-8">Check your email!</Typography.H2>
        <VerifyEmailIllustration />
        <Typography.Body className={s.message}>
          <p>
            Congratulations! You’ve successfully created your CLASSROOM account.
          </p>
          <p>
            We’ve shared a link to <b>{userEmail}.</b> Click on the link to
            confirm your email address and get started.
          </p>
          <p>
            Make sure to check your spam. If you need any support please{' '}
            <Typography.Link type="inline-gray">
              <a href="mailto:support@boclips.com">contact us</a>.
            </Typography.Link>
          </p>
        </Typography.Body>
      </main>
      <Confetti />
    </>
  );
};

export default ClassroomEmailVerificationPrompt;
