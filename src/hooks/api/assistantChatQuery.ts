import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { useMutation } from '@tanstack/react-query';
import { ChatRequest } from 'boclips-api-client/dist/sub-clients/chat/model/ChatRequest';
import { ChatResult } from 'boclips-api-client/dist/sub-clients/chat/model/ChatResult';

export const useChat = () => {
  const client = useBoclipsClient();
  return useMutation(
    (request: ChatRequest): Promise<ChatResult> => client.chat.doChat(request),
  );
};
