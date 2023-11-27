import React from 'react';
import { Typography } from '@boclips-ui/typography';
import ScrollToTop from 'src/hooks/scrollToTop';
import s from './style.module.less';
import VerifyEmailIllustration from '../../resources/icons/registration-verify-email-illustration.svg';

interface EmailVerificationPromptProps {
  userEmail: string;
}
const EmailVerificationPrompt = ({
  userEmail,
}: EmailVerificationPromptProps) => {
  return (
    <main tabIndex={-1} className={s.emailVerificationPromptWrapper}>
      <ScrollToTop />
      <Typography.H2 className="mb-4">Check your email!</Typography.H2>
      <VerifyEmailIllustration />
      <Typography.Body className={s.message}>
        <p>
          Congratulations! You have successfully created your free Boclips trial
          account.
        </p>
        <p>
          We’ve emailed a special link to <b>{userEmail}.</b>
          <br />
          Click the link to confirm your address and get started.
        </p>
        <p>
          Make sure to check your spam or junk. If you still have trouble you
          can{' '}
          <Typography.Link type="inline-gray">
            <a href="mailto:support@boclips.com">contact support</a>.
          </Typography.Link>
        </p>
      </Typography.Body>
    </main>
  );
};

export default EmailVerificationPrompt;
