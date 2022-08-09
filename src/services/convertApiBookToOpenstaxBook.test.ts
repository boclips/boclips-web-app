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
    };

    const openstaxBook = convertApiBookToOpenstaxBook(apiBook);

    expect(openstaxBook.id).toEqual('bookid');
    expect(openstaxBook.subject).toEqual('Maths');
    expect(openstaxBook.title).toEqual('Algebra and Trigonometry');
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
          videos: [],
          videoIds: ['7'],
        }),
        ChapterFactory.sample({
          sections: [],
          videos: [],
          videoIds: ['8'],
        }),
      ],
    });

    const openstaxBook = convertApiBookToOpenstaxBook(apiBook);
    expect(openstaxBook.videoCount).toEqual(6);
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
          videos: [
            VideoFactory.sample({ id: '1' }),
            VideoFactory.sample({ id: '2' }),
          ],
          videoIds: ['1', '2'],
        },
      ],
    });

    const openstaxBook = convertApiBookToOpenstaxBook(apiBook);
    expect(openstaxBook.chapters.length).toEqual(1);
    const chapter = openstaxBook.chapters[0];
    expect(chapter.title).toEqual('chapterA');
    expect(chapter.number).toEqual(1);
    expect(chapter.displayLabel).toEqual('Chapter 1: chapterA');
    expect(chapter.videos).toEqual(apiBook.chapters[0].videos);
    expect(chapter.videoIds).toEqual(apiBook.chapters[0].videoIds);
    expect(chapter.videoCount).toEqual(6);
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
        videos: undefined,
        videoIds: [],
      });

      const openstaxBook = convertApiBookToOpenstaxBook(
        BookFactory.sample({ chapters: [chapter] }),
      );

      expect(openstaxBook.chapters[0].videoCount).toEqual(0);
    });

    it('returns sum of section videos correctly, when chapter videos are missing', () => {
      const chapter: Chapter = ChapterFactory.sample({
        sections: [
          SectionFactory.sample({
            videos: [VideoFactory.sample({})],
            videoIds: ['1'],
          }),
        ],
        videos: undefined,
      });

      const openstaxBook = convertApiBookToOpenstaxBook(
        BookFactory.sample({ chapters: [chapter] }),
      );

      expect(openstaxBook.chapters[0].videoCount).toEqual(1);
    });

    it('returns number of chapter videos when section videos are missing', () => {
      const chapter: Chapter = ChapterFactory.sample({
        sections: [
          SectionFactory.sample({
            videos: undefined,
          }),
        ],
        videos: [VideoFactory.sample({})],
        videoIds: ['1'],
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
        videos: [VideoFactory.sample({})],
        videoIds: ['1'],
      });

      const openstaxBook = convertApiBookToOpenstaxBook(
        BookFactory.sample({ chapters: [chapter] }),
      );

      expect(openstaxBook.chapters[0].videoCount).toEqual(2);
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
});
