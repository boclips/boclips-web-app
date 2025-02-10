import React from 'react';
import { useAssistantContextProvider } from 'src/components/assistant/context/assistantContextProvider';
import { Clip } from 'boclips-api-client/dist/sub-clients/chat/model/Clip';
import { convertToConversationHistory } from 'src/components/assistant/conversations/ConversationHistoryConverter';
import { AnswerClip } from 'src/components/assistant/conversations/AnswerClip';
import { Typography } from '@boclips-ui/typography';
import { HighlightIcon } from 'src/components/assistant/common/HighlightIcon';
import s from './style.module.less';

export interface ConversationEntry {
  question: string;
  answer?: {
    content: string;
    clips: Clip[];
  };
}

const AssistantConversations = () => {
  const { chatHistory } = useAssistantContextProvider();

  const conversationHistory = convertToConversationHistory(chatHistory);

  return (
    <div className={s.assistantConversations}>
      <div className={s.header}>
        <HighlightIcon />
        <Typography.H1 size="sm">Conversation Highlights</Typography.H1>
      </div>
      {conversationHistory.map((ch) =>
        ch.answer?.clips.length > 0 ? (
          <div className={s.conversationEntry}>
            <p className={s.question}>From {ch.question}</p>
            <ul className={s.answers}>
              {ch.answer?.clips.map((it) => {
                return (
                  <li>
                    <AnswerClip clip={it} />
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null,
      )}
    </div>
  );
};

export default AssistantConversations;
