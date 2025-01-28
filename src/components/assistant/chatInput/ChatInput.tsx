import React, { useEffect, useState } from 'react';
import { Typography } from '@boclips-ui/typography';
import Button from '@boclips-ui/button';
import {
  ChatHistory,
  useAssistantContextProvider,
} from 'src/components/assistant/context/assistantContextProvider';
import { ChatResult } from 'boclips-api-client/dist/sub-clients/chat/model/ChatResult';
import { useChat } from 'src/hooks/api/assistantChatQuery';
import LoadingDots from 'src/resources/icons/loading-dots.svg';
import SendIcon from 'src/resources/icons/send.svg';
import BetaIcon from 'src/resources/icons/beta.svg';
import ErrorIcon from 'src/resources/icons/error-icon.svg';
import WarningIcon from 'src/resources/icons/info.svg';
import s from './style.module.less';
import { getRandomQuestions } from './promoQuestions';

export const ChatInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [randomQuestion, setRandomQuestions] = useState<string[]>([]);
  const {
    mutate: doChat,
    data: chatResponse,
    isLoading: isChatResponseLoading,
    isError: isChatResponseError,
  } = useChat();

  const {
    conversationId,
    setConversationId,
    chatHistory,
    setChatHistory,
    setIsLoading,
    abortController,
  } = useAssistantContextProvider();

  const saveUserInputToChatHistory = (question: string): ChatHistory[] => {
    const userInput: ChatHistory = {
      role: 'user',
      content: question,
    };

    setChatHistory((prevState: ChatHistory[]) => [...prevState, userInput]);

    return [...chatHistory, userInput];
  };

  const saveAssistantResponseToChatHistory = (response: ChatResult) => {
    const assistantInput: ChatHistory = {
      role: 'assistant',
      content: response.answer,
      clips: response.clips,
    };

    const lastEntry = chatHistory[chatHistory.length - 1];

    if (
      assistantInput.role === lastEntry.role &&
      assistantInput.content === lastEntry.content &&
      assistantInput.clips === lastEntry.clips
    ) {
      return;
    }

    setChatHistory((prevState: ChatHistory[]) => [
      ...prevState,
      assistantInput,
    ]);
  };

  function getConversationId() {
    if (!conversationId) {
      const id = new Date().getTime().toString();
      setConversationId(id);
      return id;
    }
    return conversationId;
  }

  function sendChatQuestion(history: ChatHistory[]) {
    setInputValue('');
    doChat({
      chatRequest: {
        model: 'langchain5-gpt4-markdown',
        conversationId: getConversationId(),
        chatHistory: history.map(({ role, content }) => ({ role, content })),
      },
      abortSignal: abortController.current.signal,
    });
  }

  const onSubmit = (suggestion?: string) => {
    const input = (suggestion ?? inputValue).trim();

    if (!input) return;

    const history = saveUserInputToChatHistory(input);
    sendChatQuestion(history);
    setInputValue('');
    setIsLoading(true);
  };

  useEffect(() => {
    if (chatResponse) {
      saveAssistantResponseToChatHistory(chatResponse);
      setIsLoading(false);
    }
  }, [chatResponse]);

  const onChange = (value: string) => {
    setInputValue(value);
  };

  const handleTextArea = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.target.rows += 1;
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (isChatResponseLoading) return;
      onSubmit();
    }
  };

  const handleSuggestion = (e) => {
    onSubmit(e.currentTarget.innerText);
  };

  useEffect(() => {
    setRandomQuestions(getRandomQuestions());
  }, []);

  return (
    <div className={s.promptWrapper}>
      {chatHistory.length === 0 ? (
        <ul className={s.sampleQuestions}>
          {randomQuestion.map((it) => {
            return (
              <Typography.Body onClick={handleSuggestion} as="li" key={it}>
                {it}
              </Typography.Body>
            );
          })}
        </ul>
      ) : null}
      {isChatResponseError && (
        <div className={s.errorWrapper}>
          <div className={s.errorMessage}>
            <ErrorIcon />
            <Typography.Body as="p">
              Sorry, something went wrong with this request, please try again.
            </Typography.Body>
          </div>
          <Button
            onClick={() => sendChatQuestion(chatHistory)}
            text="Retry"
            className={s.retryButton}
          />
        </div>
      )}
      <div className={s.chatInputWrapper}>
        <div className={s.chatInput}>
          <textarea
            id="prompt-textarea"
            rows={1}
            placeholder="Message Boclips Assistant…"
            className={s.prompt}
            onKeyDown={(e) => handleTextArea(e)}
            value={inputValue}
            onChange={(e) => onChange(e.currentTarget.value)}
          />
          <Button
            onClick={() => onSubmit()}
            icon={isChatResponseLoading ? <LoadingDots /> : <SendIcon />}
            iconOnly
            disabled={isChatResponseLoading}
            width="3.5rem"
            height="3rem"
            className={s.submitButton}
          />
        </div>
        <div className={s.uploadAndBetaRow}>
          <div className={s.betaBadge}>
            <BetaIcon />
            <Typography.Body>Beta</Typography.Body>
          </div>
        </div>
        <Typography.Body as="p" size="small" className={s.assistantWarning}>
          <WarningIcon />
          Boclips Assistant is in beta and powered by generative AI and so may
          make mistakes. Please review important information.
        </Typography.Body>
      </div>
    </div>
  );
};
