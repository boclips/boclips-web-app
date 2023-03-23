import { getSelectedTarget } from 'src/components/sparks/themePage/helpers/themeNavigationHelpers';
import {
  TargetFactory,
  ThemeFactory,
  TopicFactory,
} from 'boclips-api-client/dist/test-support/ThemeFactory';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/theme/Theme';

describe('NavigationHelper', () => {
  const theme: Theme = ThemeFactory.sample({
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
    ['topic-0', 'Chapter Overview', 'topic-0-target-0'],
    ['topic-0-target-2', '1.1 Section 1', 'topic-0-target-2'],
    ['topic-0-target-1', 'Discussion Prompt', 'topic-0-target-1'],
    ['topic-1', '2.1 Section 1', 'topic-1-target-0'],
    ['topic-1-target-0', '2.1 Section 1', 'topic-1-target-0'],
    ['topic-1-target-1', '2.2 Section 2', 'topic-1-target-1'],
  ])(
    'maps %s correctly to section titled as %s',
    (navigationFragment: string, sectionTitle: string, sectionId: string) => {
      const section = getSelectedTarget(theme, navigationFragment);
      expect(section.title).toBe(sectionTitle);
      expect(section.id).toBe(sectionId);
    },
  );

  it.each([
    ['topic-10'],
    ['top-1-target-abs'],
    ['top-kkk-target-abs'],
    ['discussion-prompt'],
    ['chapter-overview'],
    ['blabla'],
    ['topic-0-target-2137'],
  ])(
    'unknown key %s is mapped to first available section in the book',
    (key: string) => {
      const section = getSelectedTarget(theme, key);
      expect(section.title).toBe('Chapter Overview');
    },
  );

  it('unknown section in a valid chapter shows the first valid chapter element', () => {
    const section = getSelectedTarget(theme, 'topic-0-target-12');
    expect(section.title).toBe('Chapter Overview');
  });
});
