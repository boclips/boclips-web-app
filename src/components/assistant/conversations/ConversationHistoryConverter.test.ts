import { convertToConversationHistory } from 'src/components/assistant/conversations/ConversationHistoryConverter';

describe('Conversation History Converter', () => {
  it('converts null chat history', () => {
    expect(convertToConversationHistory(null)).toHaveLength(0);
  });

  it('converts empty chat history to empty conversation history', () => {
    expect(convertToConversationHistory([])).toHaveLength(0);
  });

  it('converts a single user entry into an entry with only a question', () => {
    expect(
      convertToConversationHistory([
        {
          role: 'user',
          content: 'What is the meaning of life, the universe and everything?',
        },
      ]),
    ).toContainEqual({
      question: 'What is the meaning of life, the universe and everything?',
    });
  });

  it('converts a entries with question and answer', () => {
    expect(
      convertToConversationHistory([
        {
          role: 'user',
          content: 'What is the meaning of life, the universe and everything?',
        },
        {
          role: 'assistant',
          content: '42',
          clips: {
            'clip-1': {
              clipName: '42',
              videoId: 'video-1',
              clipId: 'clip-1',
              startTime: 10,
              endTime: 20,
              clipDuration: 10,
            },
          },
        },
      ]),
    ).toContainEqual({
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
    });
  });

  it('converts a mix of entries with question and answer and only questions', () => {
    expect(
      convertToConversationHistory([
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
          clips: {
            'clip-1': {
              clipName: '42',
              videoId: 'video-1',
              clipId: 'clip-1',
              startTime: 10,
              endTime: 20,
              clipDuration: 10,
            },
          },
        },
      ]),
    ).toEqual([
      {
        question: 'Who framed Roger Rabbit?',
      },
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
    ]);
  });
});
