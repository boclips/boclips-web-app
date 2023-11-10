import React from 'react';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

const WelcomeHeader = () => {
  return (
    <section className={s.header}>
      <Typography.H3>
        You&apos;ve just been added to Boclips by your colleague
      </Typography.H3>
    </section>
  );
};

export default WelcomeHeader;
