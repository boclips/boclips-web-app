import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { CancelledError, useMutation, useQuery } from '@tanstack/react-query';
import { ChatRequest } from 'boclips-api-client/dist/sub-clients/chat/model/ChatRequest';
import { ChatResult } from 'boclips-api-client/dist/sub-clients/chat/model/ChatResult';
import { BoclipsClient } from 'boclips-api-client';
import { ChatClipFeedbackRequest } from 'boclips-api-client/dist/sub-clients/chat/model/ChatClipFeedbackRequest';

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

export const useGetClipFeedbackOptionsQuery = () => {
  const client = useBoclipsClient();
  return useQuery(['clip-feedback-options'], () =>
    doGetClipFeedbackOptions(client),
  );
};

const doGetClipFeedbackOptions = (client: BoclipsClient) =>
  client.chat.getClipFeedbackOptions();

export const sendClipFeedback = (
  request: ChatClipFeedbackRequest,
  client: BoclipsClient,
  abortSignal?: AbortSignal,
) => client.chat.sendClipFeedback(request, abortSignal);
