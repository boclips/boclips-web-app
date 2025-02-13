import React, { useEffect, useRef } from 'react';
import { Typography } from '@boclips-ui/typography';
import {
  Answer,
  useAssistantContextProvider,
} from 'src/components/assistant/context/assistantContextProvider';
import c from 'classnames';
import { Clip } from 'boclips-api-client/dist/sub-clients/chat/model/Clip';
import { ChatIntro } from 'src/components/assistant/chatIntro/ChatIntro';
import Markdown from 'react-markdown';
import AssistantIcon from 'resources/icons/boclips-assistant.svg';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import HighlightPlayer from 'src/components/assistant/player/HighlightPlayer';
import s from './style.module.less';

export const ChatArea = () => {
  const { data: user, isLoading: userIsLoading } = useGetUserQuery();
  const { conversationHistory, isLoading } = useAssistantContextProvider();

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

  const handleAnswerWithClips = (item: Answer) => {
    const { content, clips } = item;
    const regex = /\[BOVIDEO: (\w+)\]/g;
    let lastIndex = 0;
    const result: Array<string | Clip> = [];

    content.replace(regex, (substring, clipId, index) => {
      result.push(content.substring(lastIndex, index));

      if (clipId && clips) {
        result.push(clips.find((clip) => clip.clipId === clipId));
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
        {conversationHistory.map((item, index) => {
          return (
            <div key={`entry_${index.toString()}`}>
              <div
                className={s.chatItem}
                key={`question_${index.toString()}`}
                id={`question_${index.toString()}`}
              >
                <div className={s.messengerName}>
                  <div className={s.messengerIcon}>{userInitials}</div>
                  <Typography.Title2>You</Typography.Title2>
                </div>
                <Typography.Body className={s.question}>
                  <p>{item.question}</p>
                </Typography.Body>
              </div>
              {item.answer && (
                <div
                  className={s.chatItem}
                  key={`answer_${index.toString()}`}
                  id={`answer_${index.toString()}`}
                >
                  <div className={s.messengerName}>
                    <div className={s.boclipsAssistantIcon}>
                      <AssistantIcon />
                    </div>
                    <Typography.Title2>Boclips Assistant</Typography.Title2>
                  </div>

                  {item.answer?.clips?.length === 0 ? (
                    <Typography.Body
                      className={s.answer}
                      key={`answer_${index.toString()}_content}`}
                    >
                      <Markdown>{item.answer.content}</Markdown>
                    </Typography.Body>
                  ) : (
                    <div className={s.answer}>
                      {handleAnswerWithClips(item.answer).map(
                        (it: string | Clip, clipIndex) => {
                          if (typeof it === 'string') {
                            return (
                              <Typography.Body
                                className={s.answer}
                                key={`answer_${index.toString()}_content_${clipIndex}`}
                              >
                                <Markdown>{it}</Markdown>
                              </Typography.Body>
                            );
                          }
                          return (
                            <div
                              className={s.answerClipContainer}
                              key={`answer_${index.toString()}_${it.clipId}`}
                              id={`answer_${index.toString()}_${it.clipId}`}
                            >
                              <HighlightPlayer clip={it} />
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
