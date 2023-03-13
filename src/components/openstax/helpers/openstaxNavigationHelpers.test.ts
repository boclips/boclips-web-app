import { getSelectedChapterElement } from 'src/components/openstax/helpers/openstaxNavigationHelpers';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { OpenstaxBookFactory } from 'src/testSupport/OpenstaxBookFactory';
import {
  TargetFactory,
  TopicFactory,
} from 'boclips-api-client/dist/test-support/ThemeFactory';

describe('openstaxNavigationHelper', () => {
  const book: OpenstaxBook = OpenstaxBookFactory.sample({
    topics: [
      TopicFactory.sample({
        index: 0,
        targets: [
          TargetFactory.sample({ index: 0, title: 'Chapter Overview' }),
          TargetFactory.sample({ index: 2, title: '1.1 Section 1' }),
          TargetFactory.sample({ index: 1, title: 'Discussion Prompt' }),
        ],
      }),
      TopicFactory.sample({
        index: 1,
        targets: [
          TargetFactory.sample({ index: 0, title: '2.1 Section 1' }),
          TargetFactory.sample({ index: 1, title: '2.2 Section 2' }),
        ],
      }),
    ],
  });

  it.each([
    ['chapter-0', 'Chapter Overview', 'chapter-0'],
    ['chapter-0-section-2', '1.1 Section 1', 'chapter-0-section-2'],
    [
      'chapter-0-discussion-prompt',
      'Discussion Prompt',
      'chapter-0-discussion-prompt',
    ],
    ['chapter-1', '2.1 Section 1', 'chapter-1-section-0'],
    ['chapter-1-section-0', '2.1 Section 1', 'chapter-1-section-0'],
    ['chapter-1-section-1', '2.2 Section 2', 'chapter-1-section-1'],
  ])(
    'maps %s correctly to section titled as %s',
    (navigationFragment: string, sectionTitle: string, sectionId: string) => {
      const section = getSelectedChapterElement(book, navigationFragment);
      expect(section.title).toBe(sectionTitle);
      expect(section.id).toBe(sectionId);
    },
  );

  it.each([
    ['chapter-10'],
    ['chap-1-section-abs'],
    ['chap-kkk-section-abs'],
    ['discussion-prompt'],
    ['chapter-overview'],
    ['blabla'],
    ['chapter-0-section-2137'],
  ])(
    'unknown key %s is mapped to first available section in the book',
    (key: string) => {
      const section = getSelectedChapterElement(book, key);
      expect(section.title).toBe('Chapter Overview');
    },
  );

  it('unknown section in a valid chapter shows the first valid chapter element', () => {
    const section = getSelectedChapterElement(book, 'chapter-0-section-12');
    expect(section.title).toBe('Chapter Overview');
  });
});
