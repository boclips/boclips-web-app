import React from 'react';
import Button from '@boclips-ui/button';
import s from 'src/components/assistant/style.module.less';
import { useAssistantContextProvider } from 'src/components/assistant/context/assistantContextProvider';
import NewConversationIcon from 'resources/icons/new-conversation.svg';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { Typography } from '@boclips-ui/typography';
import { useNavigate } from 'react-router-dom';

const AssistantSidebar = () => {
  const navigate = useNavigate();
  const {
    setConversationId,
    conversationHistory,
    setConversationHistory,
    setIsLoading,
    abortController,
  } = useAssistantContextProvider();

  const handleReset = () => {
    abortController.current.abort();
    abortController.current = new AbortController();
    setConversationHistory([]);
    setConversationId('');
    setIsLoading(false);
    AnalyticsFactory.pendo().trackAssistantConversationReset();
  };

  const handleTrapDoor = (testName: string) => {
    abortController.current.abort();
    abortController.current = new AbortController();
    setIsLoading(false);
    AnalyticsFactory.pendo().trackTrapDoorInterest(testName);
    navigate({
      pathname: '/assistant/generate',
    });
  };

  return (
    <div className={s.assistantSidebar}>
      {conversationHistory.length !== 0 ? (
        <div>
          <Button
            type="outline"
            className={s.newConversationButton}
            height="48px"
            width="100%"
            onClick={handleReset}
            text="Start new conversation"
            icon={<NewConversationIcon />}
          />
          <div className={s.trapDoor}>
            <Typography.Body as="p">
              Can&apos;t find what you&apos;re looking for?
            </Typography.Body>
            <Button
              type="outline"
              height="48px"
              width="100%"
              onClick={() => handleTrapDoor('Boclips Generate')}
              text="Generate your own video"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AssistantSidebar;
