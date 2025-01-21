import React from 'react';
import c from 'classnames';
import ChatbotIntro from 'src/components/assistant/chatbotIntro';
import s from './style.module.less';

const AssistantChatBox = () => {
  return (
    <div
      className={c('row-start-2 row-end-3 col-start-7 col-end-20', s.chatbot)}
    >
      <ChatbotIntro />
    </div>
  );
};

export default AssistantChatBox;
