import React from 'react';
import c from 'classnames';
import s from './style.module.less';

const AssistantChatBox = () => {
  return (
    <div
      className={c('row-start-3 row-end-4 col-start-7 col-end-20', s.chatbot)}
    />
  );
};

export default AssistantChatBox;
