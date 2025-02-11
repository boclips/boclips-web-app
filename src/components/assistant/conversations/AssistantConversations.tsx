import React from 'react';
import { useAssistantContextProvider } from 'src/components/assistant/context/assistantContextProvider';
import { AnswerClip } from 'src/components/assistant/conversations/AnswerClip';
import { Typography } from '@boclips-ui/typography';
import { HighlightIcon } from 'src/components/assistant/common/HighlightIcon';
import { Content, List, Root, Trigger } from '@radix-ui/react-tabs';
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

  const allClipCount = conversationHistory.reduce((acc, entry) => {
    return acc + (entry?.answer?.clips?.length ?? 0);
  }, 0);

  return (
    <div className={s.assistantConversationsWrapper}>
      {conversationHistory.length > 0 && (
        <div className={s.assistantConversations}>
          <div className={s.header}>
            <HighlightIcon />
            <Typography.H1 size="sm">Conversation Highlights</Typography.H1>
          </div>
          <Root defaultValue="all" orientation="horizontal">
            <List className={s.modeButtons}>
              <Trigger value="all" className={s.modeButton}>
                <span>All</span>
                {allClipCount > 0 && (
                  <span className={s.modeCount}>{allClipCount}</span>
                )}
              </Trigger>
              <Trigger value="playlists" className={s.modeButton}>
                <span>Added to playlist</span>
              </Trigger>
              <Trigger value="shared" className={s.modeButton}>
                <span>Shared</span>
              </Trigger>
            </List>
            <Content value="all" className={s.modeContent}>
              {conversationHistory.map(
                (entry, index) =>
                  entry.answer?.clips?.length > 0 && (
                    <div className={s.conversationEntry}>
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
                            <li>
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
            </Content>
          </Root>
        </div>
      )}
    </div>
  );
};

export default AssistantConversations;
