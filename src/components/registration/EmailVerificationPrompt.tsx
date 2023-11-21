import React from 'react';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';
import VerifyEmailIllustration from '../../resources/icons/registration-verify-email-illustration.svg';

interface EmailVerificationPromptProps {
  accountName: string;
  userEmail: string;
}
const EmailVerificationPrompt = ({
  accountName,
  userEmail,
}: EmailVerificationPromptProps) => {
  return (
    <main tabIndex={-1} className={s.emailVerificationPromptWrapper}>
      <Typography.H2 className="mb-4">Verify your Email</Typography.H2>
      <VerifyEmailIllustration />
      <Typography.Body className={s.message}>
        <p>
          Congratulations! You have successfully signed up for your Boclips
          trial.
        </p>
        <p>
          <b>
            We have sent an email to {userEmail}. Check your email inbox now
          </b>{' '}
          to finish signing up and get started.
        </p>
        <p className={s.accountDetails}>
          <div>
            <b>Account</b>: {accountName}
          </div>
          <div>
            <b>Profile</b>: {userEmail}
          </div>
        </p>
        <p>
          Didn&apos;t receive email? Please check your spam or junk. If you
          still have trouble please{' '}
          <Typography.Link type="inline-gray">
            <a href="mailto:support@boclips.com">contact support</a>.
          </Typography.Link>
        </p>
      </Typography.Body>
    </main>
  );
};

export default EmailVerificationPrompt;
