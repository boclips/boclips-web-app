import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { CancelledError, useMutation } from '@tanstack/react-query';
import { ChatRequest } from 'boclips-api-client/dist/sub-clients/chat/model/ChatRequest';
import { ChatResult } from 'boclips-api-client/dist/sub-clients/chat/model/ChatResult';

interface UseChatRequest {
  chatRequest: ChatRequest;
  abortSignal?: AbortSignal;
}

export const useChat = () => {
  const client = useBoclipsClient();
  return useMutation(
    ({
      chatRequest,
      abortSignal,
    }: UseChatRequest): Promise<ChatResult | void> =>
      client.chat
        .doChat(chatRequest, abortSignal)
        .catch((_: CancelledError) => {}),
  );
};
