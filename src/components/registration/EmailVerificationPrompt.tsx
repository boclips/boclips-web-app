import React from 'react';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

const EmailVerificationPrompt = () => {
  return (
    <main tabIndex={-1} className={s.emailVerificationPromptWrapper}>
      <Typography.H3>Verify your Email</Typography.H3>
    </main>
  );
};

export default EmailVerificationPrompt;
