import React, { createContext, useContext, useMemo, useState } from 'react';
import { ChatResult } from 'boclips-api-client/dist/sub-clients/chat/model/ChatResult';
import { Clip } from 'boclips-api-client/dist/sub-clients/chat/model/Clip';

interface ContextProps {
  conversationId: string | null;
  setConversationId: (id: string) => void;
  chatHistory: ChatHistory[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatHistory[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Props {
  children: React.ReactNode;
}

export interface ChatHistory {
  role: string;
  content: string;
  clips?: { [id: string]: Clip };
}

const tutorContext = createContext<ContextProps>({
  conversationId: null,
  chatHistory: [],
  setChatHistory: () => null,
  setConversationId: () => null,
  isLoading: false,
  setIsLoading: () => null,
});

const AssistantContextProvider = ({ children }: Props) => {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [lakituResponse, setLakituResponse] = useState<ChatResult[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    }),
    [chatHistory, lakituResponse, conversationId, isLoading, setIsLoading],
  );

  return (
    <tutorContext.Provider value={context}>{children}</tutorContext.Provider>
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
  } = useContext(tutorContext);

  return {
    conversationId,
    setConversationId,
    chatHistory,
    setChatHistory,
    isLoading,
    setIsLoading,
  };
}

export { AssistantContextProvider, useAssistantContextProvider };
