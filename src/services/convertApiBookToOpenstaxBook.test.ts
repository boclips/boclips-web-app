import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { convertApiTheme } from 'src/services/convertApiTheme';
import {
  Theme,
  Topic,
} from 'boclips-api-client/dist/sub-clients/alignments/model/Theme';
import {
  TargetFactory,
  ThemeFactory,
  TopicFactory,
} from 'boclips-api-client/dist/test-support/ThemeFactory';

describe('OpenstaxBook converter', () => {
  it('converts basic theme details', () => {
    const apiTheme: Theme = {
      id: 'bookid',
      type: 'Maths',
      title: 'Algebra and Trigonometry',
      topics: [],
      logoUrl: 'svg.com',
      provider: 'openstax',
      links: {},
    };

    const openstaxBook = convertApiTheme(apiTheme);

    expect(openstaxBook.id).toEqual('bookid');
    expect(openstaxBook.type).toEqual('Maths');
    expect(openstaxBook.title).toEqual('Algebra and Trigonometry');
    expect(openstaxBook.logoUrl).toEqual('svg.com');
    expect(openstaxBook.provider).toEqual('openstax');
  });

  it('calculates theme video count', () => {
    const apiTheme: Theme = ThemeFactory.sample({
      topics: [
        TopicFactory.sample({
          targets: [
            TargetFactory.sample({
              videos: [],
              videoIds: ['1', '2'],
            }),
            TargetFactory.sample({
              videos: [],
              videoIds: ['3', '4'],
            }),
          ],
        }),
        TopicFactory.sample({
          targets: [],
        }),
      ],
    });

    const openstaxBook = convertApiTheme(apiTheme);
    expect(openstaxBook.videoCount).toEqual(4);
  });

  it('converts topic details', () => {
    const apiTheme: Theme = ThemeFactory.sample({
      topics: [
        {
          index: 0,
          title: 'chapterA',
          targets: [
            TargetFactory.sample({
              videos: [
                VideoFactory.sample({ id: '3' }),
                VideoFactory.sample({ id: '4' }),
              ],
              videoIds: ['3', '4'],
            }),
            TargetFactory.sample({
              videos: [
                VideoFactory.sample({ id: '5' }),
                VideoFactory.sample({ id: '6' }),
              ],
              videoIds: ['5', '6'],
            }),
          ],
        },
      ],
    });

    const openstaxBook = convertApiTheme(apiTheme);
    expect(openstaxBook.topics.length).toEqual(1);
    const chapter = openstaxBook.topics[0];
    expect(chapter.title).toEqual('chapterA');
    expect(chapter.index).toEqual(0);
    expect(chapter.videoCount).toEqual(4);
    expect(chapter.targets.length).toEqual(2);
  });

  describe('topic video count', () => {
    it("returns 0 when no videos are mapped to topic of it's targets", () => {
      const topic: Topic = TopicFactory.sample({
        targets: [
          TargetFactory.sample({
            videos: undefined,
            videoIds: [],
          }),
        ],
      });

      const openstaxBook = convertApiTheme(
        ThemeFactory.sample({ topics: [topic] }),
      );

      expect(openstaxBook.topics[0].videoCount).toEqual(0);
    });

    it('returns sum of targets videos correctly', () => {
      const topic: Topic = TopicFactory.sample({
        targets: [
          TargetFactory.sample({
            videos: [VideoFactory.sample({})],
            videoIds: ['1'],
          }),
        ],
      });

      const openstaxBook = convertApiTheme(
        ThemeFactory.sample({ topics: [topic] }),
      );

      expect(openstaxBook.topics[0].videoCount).toEqual(1);
    });

    it('returns sum of targets videos even when a targets has no videos', () => {
      const topic: Topic = TopicFactory.sample({
        targets: [
          TargetFactory.sample({
            videos: undefined,
            videoIds: [],
          }),
          TargetFactory.sample({
            videos: [VideoFactory.sample({})],
            videoIds: ['1'],
          }),
        ],
      });

      const openstaxBook = convertApiTheme(
        ThemeFactory.sample({ topics: [topic] }),
      );

      expect(openstaxBook.topics[0].videoCount).toEqual(1);
    });
  });

  it('converts target details', () => {
    const apiTheme: Theme = ThemeFactory.sample({
      topics: [
        TopicFactory.sample({
          index: 0,
          targets: [
            {
              title: 'sectionA',
              index: 0,
              videos: [
                VideoFactory.sample({ id: '1' }),
                VideoFactory.sample({ id: '2' }),
              ],
              videoIds: ['1', '2'],
            },
          ],
        }),
      ],
    });

    const openstaxBook = convertApiTheme(apiTheme);
    expect(openstaxBook.topics.length).toEqual(1);
    expect(openstaxBook.topics[0].targets.length).toEqual(1);
    const section = openstaxBook.topics[0].targets[0];
    expect(section.title).toEqual('sectionA');
    expect(section.index).toEqual(0);
    expect(section.videos).toEqual(apiTheme.topics[0].targets[0].videos);
    expect(section.videoIds).toEqual(apiTheme.topics[0].targets[0].videoIds);
    expect(section.videoCount).toEqual(2);
  });

  it('topics order received from the backend is maintained', () => {
    const apiTheme: Theme = ThemeFactory.sample({
      topics: [
        TopicFactory.sample({ index: 0 }),
        TopicFactory.sample({ index: 2 }),
        TopicFactory.sample({ index: 1 }),
      ],
    });

    const openstaxBook = convertApiTheme(apiTheme);

    expect(openstaxBook.topics.length).toEqual(3);
    expect(openstaxBook.topics[0].index).toEqual(0);
    expect(openstaxBook.topics[1].index).toEqual(2);
    expect(openstaxBook.topics[2].index).toEqual(1);
  });

  it('targets order received from the backend is maintained', () => {
    const apiTheme = ThemeFactory.sample({
      topics: [
        TopicFactory.sample({
          targets: [
            TargetFactory.sample({ index: 0 }),
            TargetFactory.sample({ index: 2 }),
            TargetFactory.sample({ index: 1 }),
          ],
        }),
      ],
    });

    const openstaxBook = convertApiTheme(apiTheme);

    expect(openstaxBook.topics[0].targets[0].index).toEqual(0);
    expect(openstaxBook.topics[0].targets[1].index).toEqual(2);
    expect(openstaxBook.topics[0].targets[2].index).toEqual(1);
  });
});
