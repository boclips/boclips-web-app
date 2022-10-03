import { getSelectedChapterElement } from 'src/components/openstax/helpers/openstaxNavigationHelpers';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { OpenstaxBookFactory } from 'src/testSupport/OpenstaxBookFactory';
import {
  ChapterFactory,
  SectionFactory,
} from 'boclips-api-client/dist/test-support/BookFactory';

describe('openstaxNavigationHelper', () => {
  const book: OpenstaxBook = OpenstaxBookFactory.sample({
    chapters: [
      ChapterFactory.sample({
        number: 1,
        sections: [
          SectionFactory.sample({ title: 'Chapter Overview' }),
          SectionFactory.sample({ number: 1, title: 'Section 1' }),
          SectionFactory.sample({ title: 'Discussion Prompt' }),
        ],
      }),
      ChapterFactory.sample({
        number: 2,
        sections: [
          SectionFactory.sample({ number: 1, title: 'Section 1' }),
          SectionFactory.sample({ number: 2, title: 'Section 2' }),
        ],
      }),
    ],
  });

  it.each([
    ['chapter-1', 'Chapter Overview'],
    ['chapter-1-section-1', '1.1 Section 1'],
    ['chapter-1-discussion-prompt', 'Discussion Prompt'],
    ['chapter-2', '2.1 Section 1'],
    ['chapter-2-section-1', '2.1 Section 1'],
    ['chapter-2-section-2', '2.2 Section 2'],
  ])(
    'maps %s correctly to section titled as %s',
    (key: string, sectionTitle: string) => {
      const section = getSelectedChapterElement(book, key);
      expect(section.displayLabel).toBe(sectionTitle);
    },
  );

  it.each([
    ['chapter-10'],
    ['chap-1-section-abs'],
    ['chap-kkk-section-abs'],
    ['discussion-prompt'],
    ['chapter-overview'],
    ['blabla'],
  ])(
    'unknown key %s is mapped to first available section in the book',
    (key: string) => {
      const section = getSelectedChapterElement(book, key);
      expect(section.displayLabel).toBe('Chapter Overview');
    },
  );

  it('unknown section in a valid chapter shows the first valid chapter element', () => {
    const section = getSelectedChapterElement(book, 'chapter-1-section-12');
    expect(section.displayLabel).toBe('Chapter Overview');
  });
});
