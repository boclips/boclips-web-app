import React, {
  createContext,
  MutableRefObject,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Clip } from 'boclips-api-client/dist/sub-clients/chat/model/Clip';

interface ContextProps {
  conversationId: string | null;
  setConversationId: (id: string) => void;
  conversationHistory: ConversationEntry[];
  setConversationHistory: React.Dispatch<
    React.SetStateAction<ConversationEntry[]>
  >;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  abortController: MutableRefObject<AbortController>;
}

interface Props {
  children: React.ReactNode;
}

export interface ConversationEntry {
  question: string;
  answer?: Answer;
}

export interface Answer {
  content: string;
  clips?: Clip[];
}

export interface ChatHistory {
  role: string;
  content: string;
  clips?: { [id: string]: Clip };
}

const assistantContext = createContext<ContextProps>({
  conversationId: null,
  setConversationId: () => null,
  conversationHistory: [],
  setConversationHistory: () => null,
  isLoading: false,
  setIsLoading: () => null,
  abortController: null,
});

const AssistantContextProvider = ({ children }: Props) => {
  const [conversationHistory, setConversationHistory] = useState<
    ConversationEntry[]
  >([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const abortController = useRef(new AbortController());

  const context = useMemo(
    () => ({
      conversationId,
      setConversationId,
      conversationHistory,
      setConversationHistory,
      isLoading,
      setIsLoading,
      abortController,
    }),
    [
      conversationHistory,
      conversationId,
      isLoading,
      setIsLoading,
      abortController,
    ],
  );

  return (
    <assistantContext.Provider value={context}>
      {children}
    </assistantContext.Provider>
  );
};

function useAssistantContextProvider() {
  const {
    conversationHistory,
    setConversationHistory,
    conversationId,
    setConversationId,
    isLoading,
    setIsLoading,
    abortController,
  } = useContext(assistantContext);

  return {
    conversationId,
    setConversationId,
    conversationHistory,
    setConversationHistory,
    isLoading,
    setIsLoading,
    abortController,
  };
}

export { AssistantContextProvider, useAssistantContextProvider };
