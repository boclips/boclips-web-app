import {
  Book,
  Chapter,
} from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { convertApiBookToOpenstaxBook } from 'src/services/convertApiBookToOpenstaxBook';
import {
  BookFactory,
  ChapterFactory,
  SectionFactory,
} from 'boclips-api-client/dist/test-support/BookFactory';

describe('OpenstaxBook converter', () => {
  it('converts basic book details', () => {
    const apiBook: Book = {
      id: 'bookid',
      subject: 'Maths',
      title: 'Algebra and Trigonometry',
      chapters: [],
      logoUrl: 'svg.com',
      provider: 'openstax',
      links: {},
    };

    const openstaxBook = convertApiBookToOpenstaxBook(apiBook);

    expect(openstaxBook.id).toEqual('bookid');
    expect(openstaxBook.subject).toEqual('Maths');
    expect(openstaxBook.title).toEqual('Algebra and Trigonometry');
    expect(openstaxBook.logoUrl).toEqual('svg.com');
    expect(openstaxBook.provider).toEqual('openstax');
  });

  it('calculates book video count', () => {
    const apiBook: Book = BookFactory.sample({
      chapters: [
        ChapterFactory.sample({
          sections: [
            SectionFactory.sample({
              videos: [],
              videoIds: ['1', '2'],
            }),
            SectionFactory.sample({
              videos: [],
              videoIds: ['3', '4'],
            }),
          ],
        }),
        ChapterFactory.sample({
          sections: [],
        }),
      ],
    });

    const openstaxBook = convertApiBookToOpenstaxBook(apiBook);
    expect(openstaxBook.videoCount).toEqual(4);
  });

  it('converts chapter details', () => {
    const apiBook: Book = BookFactory.sample({
      chapters: [
        {
          index: 0,
          title: 'chapterA',
          sections: [
            SectionFactory.sample({
              videos: [
                VideoFactory.sample({ id: '3' }),
                VideoFactory.sample({ id: '4' }),
              ],
              videoIds: ['3', '4'],
            }),
            SectionFactory.sample({
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

    const openstaxBook = convertApiBookToOpenstaxBook(apiBook);
    expect(openstaxBook.chapters.length).toEqual(1);
    const chapter = openstaxBook.chapters[0];
    expect(chapter.title).toEqual('chapterA');
    expect(chapter.index).toEqual(0);
    expect(chapter.videoCount).toEqual(4);
    expect(chapter.sections.length).toEqual(2);
  });

  describe('chapter video count', () => {
    it("returns 0 when no videos are mapped to chapter of it's sections", () => {
      const chapter: Chapter = ChapterFactory.sample({
        sections: [
          SectionFactory.sample({
            videos: undefined,
            videoIds: [],
          }),
        ],
      });

      const openstaxBook = convertApiBookToOpenstaxBook(
        BookFactory.sample({ chapters: [chapter] }),
      );

      expect(openstaxBook.chapters[0].videoCount).toEqual(0);
    });

    it('returns sum of section videos correctly', () => {
      const chapter: Chapter = ChapterFactory.sample({
        sections: [
          SectionFactory.sample({
            videos: [VideoFactory.sample({})],
            videoIds: ['1'],
          }),
        ],
      });

      const openstaxBook = convertApiBookToOpenstaxBook(
        BookFactory.sample({ chapters: [chapter] }),
      );

      expect(openstaxBook.chapters[0].videoCount).toEqual(1);
    });

    it('returns sum of section videos even when a section has no videos', () => {
      const chapter: Chapter = ChapterFactory.sample({
        sections: [
          SectionFactory.sample({
            videos: undefined,
            videoIds: [],
          }),
          SectionFactory.sample({
            videos: [VideoFactory.sample({})],
            videoIds: ['1'],
          }),
        ],
      });

      const openstaxBook = convertApiBookToOpenstaxBook(
        BookFactory.sample({ chapters: [chapter] }),
      );

      expect(openstaxBook.chapters[0].videoCount).toEqual(1);
    });
  });

  it('converts section details', () => {
    const apiBook: Book = BookFactory.sample({
      chapters: [
        ChapterFactory.sample({
          index: 0,
          sections: [
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

    const openstaxBook = convertApiBookToOpenstaxBook(apiBook);
    expect(openstaxBook.chapters.length).toEqual(1);
    expect(openstaxBook.chapters[0].sections.length).toEqual(1);
    const section = openstaxBook.chapters[0].sections[0];
    expect(section.title).toEqual('sectionA');
    expect(section.index).toEqual(0);
    expect(section.videos).toEqual(apiBook.chapters[0].sections[0].videos);
    expect(section.videoIds).toEqual(apiBook.chapters[0].sections[0].videoIds);
    expect(section.videoCount).toEqual(2);
  });

  it('converts Chapter Overview & Discussion Prompt with proper display labels', () => {
    const apiBook: Book = BookFactory.sample({
      chapters: [
        ChapterFactory.sample({
          index: 0,
          sections: [
            {
              index: 0,
              title: 'Chapter Overview',
              videoIds: [],
              videos: [VideoFactory.sample({ id: '1' })],
            },
            {
              index: 1,
              title: 'Discussion Prompt',
              videoIds: [],
              videos: [VideoFactory.sample({ id: '2' })],
            },
          ],
        }),
      ],
    });

    const openstaxBook = convertApiBookToOpenstaxBook(apiBook);
    expect(openstaxBook.chapters[0].sections).toHaveLength(0);
    expect(openstaxBook.chapters[0].chapterOverview.title).toEqual(
      'Chapter Overview',
    );
    expect(openstaxBook.chapters[0].chapterOverview.videos[0].id).toEqual('1');
    expect(openstaxBook.chapters[0].discussionPrompt.title).toEqual(
      'Discussion Prompt',
    );
    expect(openstaxBook.chapters[0].discussionPrompt.videos[0].id).toEqual('2');
  });

  it('chapters order received from the backend is maintained', () => {
    const apiBook = BookFactory.sample({
      chapters: [
        ChapterFactory.sample({ index: 0 }),
        ChapterFactory.sample({ index: 2 }),
        ChapterFactory.sample({ index: 1 }),
      ],
    });

    const openstaxBook = convertApiBookToOpenstaxBook(apiBook);

    expect(openstaxBook.chapters.length).toEqual(3);
    expect(openstaxBook.chapters[0].index).toEqual(0);
    expect(openstaxBook.chapters[1].index).toEqual(2);
    expect(openstaxBook.chapters[2].index).toEqual(1);
  });

  it('sections order received from the backend is maintained', () => {
    const apiBook = BookFactory.sample({
      chapters: [
        ChapterFactory.sample({
          sections: [
            SectionFactory.sample({ index: 0 }),
            SectionFactory.sample({ index: 2 }),
            SectionFactory.sample({ index: 1 }),
          ],
        }),
      ],
    });

    const openstaxBook = convertApiBookToOpenstaxBook(apiBook);

    expect(openstaxBook.chapters[0].sections[0].index).toEqual(0);
    expect(openstaxBook.chapters[0].sections[1].index).toEqual(2);
    expect(openstaxBook.chapters[0].sections[2].index).toEqual(1);
  });
});
