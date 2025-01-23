import React from 'react';
import c from 'classnames';
import { ChatArea } from 'src/components/assistant/chatArea/ChatArea';
import { ChatInput } from 'src/components/assistant/chatInput/ChatInput';
import s from './style.module.less';

const AssistantChatBox = () => {
  return (
    <div
      className={c('row-start-2 row-end-3 col-start-7 col-end-20', s.chatbot)}
    >
      <ChatArea />
      <ChatInput />
    </div>
  );
};

export default AssistantChatBox;
