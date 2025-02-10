import { ChatHistory } from 'src/components/assistant/context/assistantContextProvider';
import { ConversationEntry } from 'src/components/assistant/conversations/AssistantConversations';

export const convertToConversationHistory = (
  history: ChatHistory[],
): ConversationEntry[] => {
  if (!history) {
    return [];
  }

  const entries: ConversationEntry[] = [];

  history.forEach((it) => {
    if (it.role === 'user') {
      entries.push({
        question: it.content,
      });
    } else {
      entries[entries.length - 1].answer = {
        content: it.content,
        clips: Object.values(it.clips),
      };
    }
  });

  return entries;
};
