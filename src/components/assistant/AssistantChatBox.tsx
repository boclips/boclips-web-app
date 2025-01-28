import React from 'react';
import { ChatArea } from 'src/components/assistant/chatArea/ChatArea';
import { ChatInput } from 'src/components/assistant/chatInput/ChatInput';
import s from './style.module.less';

const AssistantChatBox = () => {
  return (
    <main className={s.chatBox}>
      <ChatArea />
      <ChatInput />
    </main>
  );
};

export default AssistantChatBox;
