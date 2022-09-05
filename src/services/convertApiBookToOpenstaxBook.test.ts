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
    };

    const openstaxBook = convertApiBookToOpenstaxBook(apiBook);

    expect(openstaxBook.id).toEqual('bookid');
    expect(openstaxBook.subject).toEqual('Maths');
    expect(openstaxBook.title).toEqual('Algebra and Trigonometry');
    expect(openstaxBook.logoUrl).toEqual('svg.com');
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
          number: 1,
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
    expect(chapter.number).toEqual(1);
    expect(chapter.displayLabel).toEqual('Chapter 1: chapterA');
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
          number: 1,
          sections: [
            {
              title: 'sectionA',
              number: 2,
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
    expect(section.displayLabel).toEqual('1.2 sectionA');
    expect(section.title).toEqual('sectionA');
    expect(section.number).toEqual(2);
    expect(section.videos).toEqual(apiBook.chapters[0].sections[0].videos);
    expect(section.videoIds).toEqual(apiBook.chapters[0].sections[0].videoIds);
    expect(section.videoCount).toEqual(2);
  });

  it('converts Chapter Overview & Discussion Prompt with proper display labels', () => {
    const apiBook: Book = BookFactory.sample({
      chapters: [
        ChapterFactory.sample({
          number: 1,
          sections: [
            {
              title: 'Chapter Overview',
              videoIds: [],
              videos: [VideoFactory.sample({ id: '1' })],
            },
            {
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
    expect(openstaxBook.chapters[0].chapterOverview.displayLabel).toEqual(
      'Chapter Overview',
    );
    expect(openstaxBook.chapters[0].chapterOverview.videos[0].id).toEqual('1');
    expect(openstaxBook.chapters[0].discussionPrompt.displayLabel).toEqual(
      'Discussion Prompt',
    );
    expect(openstaxBook.chapters[0].discussionPrompt.videos[0].id).toEqual('2');
  });

  it('orders chapters based on their number', () => {
    const apiBook = BookFactory.sample({
      chapters: [
        ChapterFactory.sample({ number: 3 }),
        ChapterFactory.sample({ number: 5 }),
        ChapterFactory.sample({ number: 1 }),
      ],
    });

    const openstaxBook = convertApiBookToOpenstaxBook(apiBook);

    expect(openstaxBook.chapters.length).toEqual(3);
    expect(openstaxBook.chapters[0].number).toEqual(1);
    expect(openstaxBook.chapters[1].number).toEqual(3);
    expect(openstaxBook.chapters[2].number).toEqual(5);
  });

  it('orders sections based on their number', () => {
    const apiBook = BookFactory.sample({
      chapters: [
        ChapterFactory.sample({
          sections: [
            SectionFactory.sample({ number: 12 }),
            SectionFactory.sample({ number: 1 }),
            SectionFactory.sample({ number: 3 }),
          ],
        }),
      ],
    });

    const openstaxBook = convertApiBookToOpenstaxBook(apiBook);

    expect(openstaxBook.chapters[0].sections[0].number).toEqual(1);
    expect(openstaxBook.chapters[0].sections[1].number).toEqual(3);
    expect(openstaxBook.chapters[0].sections[2].number).toEqual(12);
  });
});
