import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import c from 'classnames';
import s from './style.module.less';
import AssistantIcon from '../../resources/icons/boclips-assistant.svg';

const AssistantButton = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const isOnAssistantPage = location.pathname.includes('assistant');

  const onClick = () => {
    navigate('/assistant');
  };

  return (
    <div
      className={c(s.navButton, {
        [s.active]: isOnAssistantPage,
      })}
    >
      <button type="button" onClick={onClick} className={s.headerButton}>
        <AssistantIcon className={s.navbarIcon} />
        <span>Assistant</span>
      </button>
    </div>
  );
};

export default AssistantButton;
