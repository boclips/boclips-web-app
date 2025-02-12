import React, { useEffect, useRef } from 'react';
import { Typography } from '@boclips-ui/typography';
import {
  Answer,
  ConversationClip,
  ConversationEntry,
  useAssistantContextProvider,
} from 'src/components/assistant/context/assistantContextProvider';
import c from 'classnames';
import { ChatIntro } from 'src/components/assistant/chatIntro/ChatIntro';
import Markdown from 'react-markdown';
import AssistantIcon from 'resources/icons/boclips-assistant.svg';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import HighlightPlayer from 'src/components/assistant/player/HighlightPlayer';
import s from './style.module.less';

export const ChatArea = () => {
  const { data: user, isLoading: userIsLoading } = useGetUserQuery();
  const { conversationHistory, isLoading, setConversationHistory } =
    useAssistantContextProvider();

  const chatWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWrapperRef.current) {
      const penultimateElement =
        chatWrapperRef.current.children[
          chatWrapperRef.current.children.length - 2
        ];

      if (penultimateElement) {
        penultimateElement.scrollIntoView({
          block: 'start',
          inline: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [conversationHistory]);

  const handleClipShared = (
    entryToUpdate: ConversationEntry,
    clipId: string,
  ) => {
    const updatedHistory = conversationHistory.map((entry) => {
      if (entry !== entryToUpdate) return entry;

      return {
        ...entry,
        answer: {
          ...entry.answer,
          conversationClips: entry.answer?.conversationClips.map((clip) =>
            clip.clipId === clipId ? { ...clip, shared: true } : clip,
          ),
        },
      };
    });
    setConversationHistory(updatedHistory);
  };

  const handleAnswerWithClips = (item: Answer) => {
    const { content, conversationClips } = item;
    const regex = /\[BOVIDEO: (\w+)\]/g;
    let lastIndex = 0;
    const result: Array<string | ConversationClip> = [];

    content.replace(regex, (substring, clipId, index) => {
      result.push(content.substring(lastIndex, index));

      if (clipId && conversationClips) {
        const clip = conversationClips.find((cc) => cc.clipId === clipId);
        result.push(clip);
      }

      lastIndex = index + substring.length;
      return substring;
    });

    // Add the remaining part of the content after the last match
    if (lastIndex < content.length) {
      result.push(content.substring(lastIndex));
    }

    return result;
  };

  const userInitials = userIsLoading
    ? 'Y'
    : `${user?.firstName[0]}${user?.lastName[0]}`;

  return (
    <section className={s.chatWrapper} id="chatWrapper">
      {conversationHistory.length === 0 && <ChatIntro />}
      <div ref={chatWrapperRef}>
        {conversationHistory.map((entry, index) => {
          return (
            <div>
              <div
                className={s.chatItem}
                key={index}
                id={`question_${index.toString()}`}
              >
                <div className={s.messengerName}>
                  <div className={s.messengerIcon}>{userInitials}</div>
                  <Typography.Title2>You</Typography.Title2>
                </div>
                <Typography.Body className={s.question}>
                  <p>{entry.question}</p>
                </Typography.Body>
              </div>
              {entry.answer && (
                <div
                  className={s.chatItem}
                  key={index}
                  id={`answer_${index.toString()}`}
                >
                  <div className={s.messengerName}>
                    <div className={s.boclipsAssistantIcon}>
                      <AssistantIcon />
                    </div>
                    <Typography.Title2>Boclips Assistant</Typography.Title2>
                  </div>

                  {entry.answer?.conversationClips?.length === 0 ? (
                    <Typography.Body className={s.answer}>
                      <Markdown>{entry.answer.content}</Markdown>
                    </Typography.Body>
                  ) : (
                    <div className={s.answer}>
                      {handleAnswerWithClips(entry.answer).map(
                        (it: string | ConversationClip, clipIndex) => {
                          if (typeof it === 'string') {
                            return (
                              <Typography.Body
                                className={s.answer}
                                key={clipIndex}
                              >
                                <Markdown>{it}</Markdown>
                              </Typography.Body>
                            );
                          }
                          return (
                            <div
                              className={s.answerClipContainer}
                              id={`answer_${index.toString()}_${it.clipId}`}
                            >
                              <HighlightPlayer clip={it.clip} />
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {isLoading && (
          <div className={c(s.chatItem, s.skeleton)} key="Loading">
            <div className={s.messengerName}>
              <div className={s.boclipsAssistantIcon}>
                <AssistantIcon />
              </div>
              <Typography.Title2>Boclips Assistant</Typography.Title2>
            </div>
            <Typography.Body className={s.answer} />
          </div>
        )}
      </div>
    </section>
  );
};
