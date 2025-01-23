import React from 'react';
import { Typography } from '@boclips-ui/typography';
import Illustration from 'src/resources/icons/assistant-intro.svg';
import s from './style.module.less';

export const ChatbotIntro = () => {
  return (
    <div className={s.descriptionWrapper}>
      <Illustration className={s.introIllustration} />
      <Typography.Title2 as="div">Welcome to Highlights</Typography.Title2>
      <Typography.Body as="div">
        Start enhancing your lessons with curated educational videos from more
        than 550 premium brands, like PBS, SciShow, TED, and more.
      </Typography.Body>
      <Typography.Body as="div">To help you get started:</Typography.Body>
    </div>
  );
};
