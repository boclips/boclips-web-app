import React, { useEffect, useRef } from 'react';
import { Typography } from '@boclips-ui/typography';
import {
  ChatHistory,
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
  const { chatHistory, isLoading } = useAssistantContextProvider();

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
  }, [chatHistory]);

  const handleAnswerWithClips = (item: ChatHistory) => {
    const { content, clips } = item;
    const regex = /\[BOVIDEO: (\w+)\]/g;
    let lastIndex = 0;
    const result: Array<string | Clip> = [];

    content.replace(regex, (substring, clipId, index) => {
      result.push(content.substring(lastIndex, index));

      if (clipId && clips) {
        clips[clipId].clipId = clipId;
        result.push(clips[clipId]);
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
      {chatHistory.length === 0 && <ChatIntro />}
      <div ref={chatWrapperRef}>
        {chatHistory.map((item, index) => {
          if (item.role === 'user') {
            return (
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
                  <p>{item.content}</p>
                </Typography.Body>
              </div>
            );
          }
          if (item.role === 'assistant') {
            if (item.clips === null) {
              return (
                <div
                  className={s.chatItem}
                  key={index}
                  id={`answer_${(index - 1).toString()}`}
                >
                  <div className={s.messengerName}>
                    <div className={s.boclipsAssistantIcon}>
                      <AssistantIcon />
                    </div>
                    <Typography.Title2>Boclips Assistant</Typography.Title2>
                  </div>
                  <Typography.Body className={s.answer}>
                    <Markdown>{item.content}</Markdown>
                  </Typography.Body>
                </div>
              );
            }

            const responseWithVideos = handleAnswerWithClips(item);

            return (
              <div
                className={s.chatItem}
                key={index}
                id={`answer_${(index - 1).toString()}`}
              >
                <div className={s.messengerName}>
                  <div className={s.boclipsAssistantIcon}>
                    <AssistantIcon />
                  </div>
                  <Typography.Title2>Boclips Assistant</Typography.Title2>
                </div>
                <div className={s.answer}>
                  {responseWithVideos.map((it: string | Clip, clipIndex) => {
                    if (typeof it === 'string') {
                      return (
                        <Typography.Body className={s.answer} key={clipIndex}>
                          <Markdown>{it}</Markdown>
                        </Typography.Body>
                      );
                    }
                    return (
                      <div id={`answer_${(index - 1).toString()}_${it.clipId}`}>
                        <HighlightPlayer clip={it} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          return <div />;
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
