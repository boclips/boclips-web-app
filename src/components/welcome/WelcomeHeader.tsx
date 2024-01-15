import React from 'react';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

interface Props {
  isAdmin: boolean;
}

const WelcomeHeader = ({ isAdmin }: Props) => {
  const headerText = isAdmin
    ? 'Tell us a bit more about you'
    : 'Your colleague has invited you to a Boclips Library preview!';

  return (
    <section className={s.header}>
      <Typography.H3>{headerText}</Typography.H3>
    </section>
  );
};

export default WelcomeHeader;
