import React, { useEffect, useRef, useState } from 'react';
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
    isLoading,
    setIsLoading,
  } = useAssistantContextProvider();

  const abortController = useRef(new AbortController());

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

    setChatHistory((prevState: ChatHistory[]) => [
      ...prevState,
      assistantInput,
    ]);
  };

  function getConversationId(convId: string | null) {
    if (!convId) {
      const id = new Date().getTime().toString();
      setConversationId(id);
      return id;
    }
    return convId;
  }

  async function sendChatQuestion(history: ChatHistory[]) {
    setInputValue('');
    doChat({
      model: 'langchain5-gpt4-markdown',
      conversationId: getConversationId(conversationId),
      chatHistory: history.map(({ role, content }) => ({ role, content })),
    });
  }

  const onSubmit = async (suggestion?: string) => {
    const history = saveUserInputToChatHistory(suggestion || inputValue);
    await sendChatQuestion(history);
    setInputValue('');
  };

  useEffect(() => {
    if (chatResponse) {
      saveAssistantResponseToChatHistory(chatResponse);
    }
  }, [chatResponse]);

  const onChange = (value: string) => {
    setInputValue(value);
  };

  const handleReset = () => {
    abortController.current.abort();
    abortController.current = new AbortController();
    setInputValue('');
    setChatHistory([]);
    setConversationId('');
    setIsLoading(false);
  };

  /* eslint-disable */
  const handleTextAre = (e: any) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.target.rows = e.target.rows + 1;
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (isLoading) return;
      onSubmit();
    }
  };

  const handleSuggestion = (e: any) => {
    onSubmit(e.currentTarget.innerText);
  };
  /* eslint-enable */

  useEffect(() => {
    const getQuestion = getRandomQuestions();
    setRandomQuestions(getQuestion);
  }, []);

  return (
    <main className={s.promptWrapper}>
      {chatHistory.length === 0 ? (
        <ul className={s.testQuestions}>
          {randomQuestion.map((it) => {
            return (
              <Typography.Body onClick={handleSuggestion} as="li" key={it}>
                {it}
              </Typography.Body>
            );
          })}
        </ul>
      ) : (
        <Button
          type="outline"
          className={s.restartButton}
          width="auto"
          onClick={handleReset}
          text="Restart Conversation"
        />
      )}

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
        <textarea
          id="prompt-textarea"
          rows={1}
          placeholder="Message Boclips Assistant…"
          className={s.prompt}
          onKeyDown={(e: any) => handleTextAre(e)}
          value={inputValue}
          onChange={(e) => onChange(e.currentTarget.value)}
        />
        <Button
          onClick={() => onSubmit()}
          icon={isChatResponseLoading ? <LoadingDots /> : <SendIcon />}
          iconOnly
          disabled={isChatResponseLoading}
          width={isChatResponseLoading ? '80px' : '60px'}
          className={s.expand}
        />
      </div>
      <div className={s.betaBadge}>
        <BetaIcon />
        <Typography.Body>Beta</Typography.Body>
      </div>
      <Typography.Body as="p" size="small" className={s.assistantWarning}>
        <WarningIcon />
        Boclips Assistant is in beta and powered by generative AI and so may
        make mistakes. Please review important information.
      </Typography.Body>
    </main>
  );
};
