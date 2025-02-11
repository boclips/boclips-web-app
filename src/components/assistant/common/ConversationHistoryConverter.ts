import {
  ChatHistory,
  ConversationEntry,
} from 'src/components/assistant/context/assistantContextProvider';

export const convertToChatHistory = (
  history: ConversationEntry[],
): ChatHistory[] => {
  if (!history) {
    return [];
  }
  return history.flatMap((entry) => {
    const chatHistory = [
      {
        role: 'user',
        content: entry.question,
      },
    ];

    if (entry.answer) {
      chatHistory.push({
        role: 'assistant',
        content: entry.answer?.content,
      });
    }

    return chatHistory;
  });
};
