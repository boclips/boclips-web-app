import React from 'react';
import { useAssistantContextProvider } from 'src/components/assistant/context/assistantContextProvider';
import { Clip } from 'boclips-api-client/dist/sub-clients/chat/model/Clip';
import { convertToConversationHistory } from 'src/components/assistant/conversations/ConversationHistoryConverter';
import { AnswerClip } from 'src/components/assistant/conversations/AnswerClip';
import { Typography } from '@boclips-ui/typography';
import { HighlightIcon } from 'src/components/assistant/common/HighlightIcon';
import s from './style.module.less';

export interface ConversationEntry {
  index: string;
  question: string;
  answer?: {
    content: string;
    clips: Clip[];
  };
}

const AssistantConversations = () => {
  const { chatHistory } = useAssistantContextProvider();

  const conversationHistory = convertToConversationHistory(chatHistory);

  const jumpToQuestionSection = (index: string) => {
    document.querySelector(`#\\3${index}`).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  };

  return (
    <div className={s.assistantConversationsWrapper}>
      {conversationHistory.length > 0 && (
        <div className={s.assistantConversations}>
          <div className={s.header}>
            <HighlightIcon />
            <Typography.H1 size="sm">Conversation Highlights</Typography.H1>
          </div>
          {conversationHistory.map(
            (entry) =>
              entry.answer?.clips.length > 0 && (
                <div className={s.conversationEntry}>
                  From{' '}
                  <button
                    onClick={() => jumpToQuestionSection(entry.index)}
                    className={s.question}
                    type="button"
                  >
                    {entry.question}
                  </button>
                  <ul className={s.answers}>
                    {entry.answer?.clips.map((it) => {
                      return (
                        <li>
                          <AnswerClip clip={it} />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ),
          )}
        </div>
      )}
    </div>
  );
};

export default AssistantConversations;
