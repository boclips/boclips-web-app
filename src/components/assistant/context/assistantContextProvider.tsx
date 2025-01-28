import React, { createContext, MutableRefObject, useContext, useMemo, useRef, useState } from "react";
import { ChatResult } from 'boclips-api-client/dist/sub-clients/chat/model/ChatResult';
import { Clip } from 'boclips-api-client/dist/sub-clients/chat/model/Clip';

interface ContextProps {
  conversationId: string | null;
  setConversationId: (id: string) => void;
  chatHistory: ChatHistory[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatHistory[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  abortController: MutableRefObject<AbortController>;
}

interface Props {
  children: React.ReactNode;
}

export interface ChatHistory {
  role: string;
  content: string;
  clips?: { [id: string]: Clip };
}

const assistantContext = createContext<ContextProps>({
  conversationId: null,
  chatHistory: [],
  setChatHistory: () => null,
  setConversationId: () => null,
  isLoading: false,
  setIsLoading: () => null,
  abortController: null,
});

const AssistantContextProvider = ({ children }: Props) => {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [lakituResponse, setLakituResponse] = useState<ChatResult[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const abortController = useRef(new AbortController());

  const context = useMemo(
    () => ({
      conversationId,
      setConversationId,
      chatHistory,
      setChatHistory,
      lakituResponse,
      setLakituResponse,
      isLoading,
      setIsLoading,
      abortController,
    }),
    [
      chatHistory,
      lakituResponse,
      conversationId,
      isLoading,
      setIsLoading,
      abortController,
    ],
  );

  return (
    <assistantContext.Provider value={context}>{children}</assistantContext.Provider>
  );
};

function useAssistantContextProvider() {
  const {
    chatHistory,
    setChatHistory,
    conversationId,
    setConversationId,
    isLoading,
    setIsLoading,
    abortController,
  } = useContext(assistantContext);

  return {
    conversationId,
    setConversationId,
    chatHistory,
    setChatHistory,
    isLoading,
    setIsLoading,
    abortController,
  };
}

export { AssistantContextProvider, useAssistantContextProvider };
