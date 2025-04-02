import Button from '@boclips-ui/button';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import s from './style.module.less';

export const NavigateToAssistantPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className={s.assistantButton}>
      <Button
        onClick={() => navigate('/assistant')}
        text="Try Boclips Assistant"
        type="label"
      />
      <p>
        - Our new tool designed to help you find and use our videos more
        efficiently
      </p>
    </div>
  );
};
