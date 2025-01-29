import React, { useRef, useState } from 'react';
import { ClipFeedbackOptions } from 'boclips-api-client/dist/sub-clients/chat/model/ClipFeedbackOptions';
import Button from '@boclips-ui/button';
import c from 'classnames';
import {
  ChatHistory,
  useAssistantContextProvider,
} from 'src/components/assistant/context/assistantContextProvider';
import {
  sendClipFeedback,
  useGetClipFeedbackOptionsQuery,
} from 'src/hooks/api/assistantChatQuery';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import CloseOnClickOutside from 'src/hooks/closeOnClickOutside';
import ThumbsUp from 'resources/icons/thumbs-up.svg';
import s from './style.module.less';

interface Props {
  children: React.ReactNode;
  clipId: string;
}

const FeedbackButton = ({
  chatHistory,
  conversationId,
  clipId,
  type,
  feedbackOptions,
}: {
  chatHistory: ChatHistory[];
  conversationId: string | null;
  clipId: string;
  type: 'positive' | 'negative';
  feedbackOptions?: ClipFeedbackOptions;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonWrapperRef = useRef(null);
  const client = useBoclipsClient();
  const handleFeedbackApiResponse = feedbackOptions
    ? Object.entries(feedbackOptions[type]).map(([key, value]) => {
        return {
          id: key,
          text: value,
        };
      })
    : [];

  const handleOnClick = (selectedOptionId: string, feedbackMessage: string) => {
    const request = {
      chatHistory: chatHistory.map((entry) => {
        return {
          role: entry.role,
          content: entry.content,
        };
      }),
      conversationId,
      feedbackMessage,
      clipId,
      selectedOptionId,
    };

    sendClipFeedback(request, client);
    setIsOpen(false);
  };

  CloseOnClickOutside(buttonWrapperRef, () => setIsOpen(false));

  return (
    <div ref={buttonWrapperRef}>
      <Button
        width="52px"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={c({
          [s.active]: isOpen,
          [s.positive]: type === 'positive',
          [s.negative]: type === 'negative',
        })}
        iconOnly
        icon={<ThumbsUp />}
        type="outline"
        text=""
      />
      {isOpen && (
        <ul
          className={c({
            [s.positive]: type === 'positive',
            [s.negative]: type === 'negative',
          })}
        >
          {handleFeedbackApiResponse.map((it) => {
            return (
              <li key={it.id}>
                <Button
                  onClick={() => handleOnClick(it.id, it.text)}
                  text={it.text}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const Feedback = ({ children, clipId }: Props) => {
  const { data: feedbackOption, isLoading: feedbackLoading } =
    useGetClipFeedbackOptionsQuery();
  const { chatHistory, conversationId } = useAssistantContextProvider();

  return (
    <div className={s.playerWrapper}>
      {children}
      {!feedbackLoading ? (
        <div className={s.buttonWrapper}>
          <div className={s.actionbuttons} />
          <div className={s.feedbackButtons}>
            <p>Is this helpful?</p>
            <FeedbackButton
              chatHistory={chatHistory}
              conversationId={conversationId}
              clipId={clipId}
              feedbackOptions={feedbackOption}
              type="positive"
            />
            <FeedbackButton
              chatHistory={chatHistory}
              conversationId={conversationId}
              clipId={clipId}
              feedbackOptions={feedbackOption}
              type="negative"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Feedback;
