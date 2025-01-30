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
import { Typography } from '@boclips-ui/typography';
import CloseButton from 'src/resources/icons/cross-icon.svg';
import s from './style.module.less';

interface Props {
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
        width="40px"
        height="40px"
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
        <div
          role="dialog"
          className={c(
            {
              [s.positive]: type === 'positive',
              [s.negative]: type === 'negative',
            },
            s.feedbackOptions,
          )}
        >
          <div className={s.header}>
            <Typography.Body weight="medium">Feedback</Typography.Body>
            <button
              type="button"
              aria-label="close feedback options"
              onClick={() => setIsOpen(false)}
            >
              <CloseButton />
            </button>
          </div>
          <ul>
            {handleFeedbackApiResponse.map((it) => {
              return (
                <li>
                  {' '}
                  <Button
                    onClick={() => handleOnClick(it.id, it.text)}
                    text={it.text}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

const Feedback = ({ clipId }: Props) => {
  const { data: feedbackOption, isLoading: feedbackLoading } =
    useGetClipFeedbackOptionsQuery();
  const { chatHistory, conversationId } = useAssistantContextProvider();

  return !feedbackLoading ? (
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
  ) : null;
};

export default Feedback;
