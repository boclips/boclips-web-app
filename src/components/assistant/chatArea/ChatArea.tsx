import React, { useEffect, useRef } from 'react';
import { Typography } from '@boclips-ui/typography';
import {
  ChatHistory,
  useAssistantContextProvider,
} from 'src/components/assistant/context/assistantContextProvider';
import c from 'classnames';
import { Clip } from 'boclips-api-client/dist/sub-clients/chat/model/Clip';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { Link } from 'boclips-api-client/dist/sub-clients/common/model/LinkEntity';
import { ChatbotIntro } from 'src/components/assistant/chatbotIntro/ChatBotIntro';
import s from './style.module.less';

export const ChatArea = () => {
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

  return (
    <section ref={chatWrapperRef} className={s.chatWrapper} id="chatWrapper">
      {chatHistory.length === 0 && <ChatbotIntro />}
      <div>
        {chatHistory.map((item, index) => {
          if (item.role === 'user') {
            return (
              <div className={s.chatItem} key={index}>
                <Typography.Title2>You</Typography.Title2>
                <Typography.Body className={s.question}>
                  <p>{item.content}</p>
                </Typography.Body>
              </div>
            );
          }
          if (item.role === 'assistant') {
            if (item.clips === null) {
              return (
                <div className={s.chatItem} key={index}>
                  <Typography.Title1>Boclips</Typography.Title1>
                  <Typography.Body className={s.answer}>
                    {item.content}
                  </Typography.Body>
                </div>
              );
            }

            const responseWithVideos = handleAnswerWithClips(item);

            return (
              <div className={s.chatItem} key={index}>
                <Typography.Title1>Boclips (beta)</Typography.Title1>
                <div className={s.answer}>
                  {responseWithVideos.map((it: string | Clip, clipIndex) => {
                    if (typeof it === 'string') {
                      return (
                        <Typography.Body className={s.answer} key={clipIndex}>
                          {it}
                        </Typography.Body>
                      );
                    }
                    return (
                      <VideoPlayer
                        videoLink={
                          new Link({
                            href: `https://api.boclips.com/v1/videos/${it.videoId}`,
                            templated: false,
                          })
                        }
                        segment={{ start: it.startTime, end: it.endTime }}
                      />
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
            <Typography.Title1>Boclips (beta)</Typography.Title1>
            <Typography.Body className={s.answer} />
          </div>
        )}
      </div>
    </section>
  );
};
