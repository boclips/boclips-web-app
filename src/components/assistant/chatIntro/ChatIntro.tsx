import React from 'react';
import { Typography } from '@boclips-ui/typography';
import AssistantIcon from 'resources/icons/boclips-assistant.svg';
import s from './style.module.less';

export const ChatIntro = () => {
  return (
    <div className={s.descriptionWrapper}>
      <div className={s.introTitleWrapper}>
        <div className={s.introIcon}>
          <AssistantIcon height="1.5rem" width="1.5rem" />
        </div>
        <Typography.Title1 className={s.introTitle}>
          Assistant
        </Typography.Title1>
      </div>
      <div className={s.description}>
        <Typography.Title2 as="div">
          Welcome to Boclips Assistant
        </Typography.Title2>
        <Typography.Body as="div">
          Start enhancing your lessons with curated educational videos from more
          than 550 premium brands, like PBS, SciShow, TED, and more.
        </Typography.Body>
        <Typography.Body as="div">To help you get started:</Typography.Body>
        <Typography.Body as="div">
          <ul className={s.assistantStartPrompt}>
            <li>Try pasting in your lesson plan for suggested videos</li>
            <li>Share a standard that you&#39;d like a video for</li>
            <li>What topics are you working on?</li>
          </ul>
        </Typography.Body>
      </div>
    </div>
  );
};
