import { convertToChatHistory } from 'src/components/assistant/common/ConversationHistoryConverter';

describe('Conversation History Converter', () => {
  it('converts null conversation history', () => {
    expect(convertToChatHistory(null)).toHaveLength(0);
  });

  it('converts empty conversation history to empty chat history', () => {
    expect(convertToChatHistory([])).toHaveLength(0);
  });

  it('converts a single question entry to entry with user', () => {
    expect(
      convertToChatHistory([
        {
          question: 'What is the meaning of life, the universe and everything?',
        },
      ]),
    ).toContainEqual({
      role: 'user',
      content: 'What is the meaning of life, the universe and everything?',
    });
  });

  it('converts a entries with question and answer', () => {
    expect(
      convertToChatHistory([
        {
          question: 'What is the meaning of life, the universe and everything?',
          answer: {
            content: '42',
            clips: [
              {
                clipName: '42',
                videoId: 'video-1',
                clipId: 'clip-1',
                startTime: 10,
                endTime: 20,
                clipDuration: 10,
              },
            ],
          },
        },
      ]),
    ).toEqual([
      {
        role: 'user',
        content: 'What is the meaning of life, the universe and everything?',
      },
      {
        role: 'assistant',
        content: '42',
      },
    ]);
  });

  it('converts a mix of entries with question and answer and only questions', () => {
    expect(
      convertToChatHistory([
        {
          question: 'Who framed Roger Rabbit?',
        },
        {
          question: 'What is the meaning of life, the universe and everything?',
          answer: {
            content: '42',
          },
        },
      ]),
    ).toEqual([
      {
        role: 'user',
        content: 'Who framed Roger Rabbit?',
      },
      {
        role: 'user',
        content: 'What is the meaning of life, the universe and everything?',
      },
      {
        role: 'assistant',
        content: '42',
      },
    ]);
  });
});
