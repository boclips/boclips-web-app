import React from 'react';
import Button from '@boclips-ui/button';
import s from 'src/components/assistant/style.module.less';
import { useAssistantContextProvider } from 'src/components/assistant/context/assistantContextProvider';
import NewConversationIcon from 'resources/icons/new-conversation.svg';

const AssistantSidebar = () => {
  const {
    setConversationId,
    chatHistory,
    setChatHistory,
    setIsLoading,
    abortController,
  } = useAssistantContextProvider();

  const handleReset = () => {
    abortController.current.abort();
    abortController.current = new AbortController();
    setChatHistory([]);
    setConversationId('');
    setIsLoading(false);
  };

  return (
    <div className={s.assistantSidebar}>
      {chatHistory.length !== 0 ? (
        <Button
          type="outline"
          className={s.newConversationButton}
          height="48px"
          width="auto"
          onClick={handleReset}
          text="Start new conversation"
          icon={<NewConversationIcon />}
        />
      ) : null}
    </div>
  );
};

export default AssistantSidebar;
