import React from 'react';
import { useAssistantContextProvider } from 'src/components/assistant/context/assistantContextProvider';
import { AnswerClip } from 'src/components/assistant/conversations/AnswerClip';
import { Typography } from '@boclips-ui/typography';
import { HighlightIcon } from 'src/components/assistant/common/HighlightIcon';
import s from './style.module.less';

const AssistantConversations = () => {
  const { conversationHistory } = useAssistantContextProvider();

  const jumpToQuestionSection = (index: number) => {
    document.querySelector(`#question_${index.toString()}`).scrollIntoView({
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
            (entry, index) =>
              entry.answer?.clips?.length > 0 && (
                <div
                  className={s.conversationEntry}
                  key={`conversation_highlight_${index}`}
                >
                  From{' '}
                  <button
                    onClick={() => jumpToQuestionSection(index)}
                    className={s.question}
                    type="button"
                  >
                    {entry.question}
                  </button>
                  <ul className={s.answers}>
                    {entry.answer?.clips?.map((clip) => {
                      return (
                        <li key={`answer_${index}_${clip.clipId}`}>
                          <AnswerClip
                            clip={clip}
                            id={`answer_${index}_${clip.clipId}`}
                          />
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
