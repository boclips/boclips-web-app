import React from 'react';
import { renderWithClients } from 'src/testSupport/render';
import { Content } from 'src/components/sparks/themePage/theme/Content';
import { ThemeMobileMenuProvider } from 'src/components/common/providers/ThemeMobileMenuProvider';
import {
  chapterTitle,
  navigateTo,
} from 'src/views/openstax/book/OpenstaxBookTestSupport';
import PaginationPanel from 'src/components/sparks/themePage/theme/pagination/PaginationPanel';
import { getProviderByName } from 'src/views/openstax/provider/AlignmentProviderFactory';
import { AlignmentContextProvider } from 'src/components/common/providers/AlignmentContextProvider';
import { ThemeFactory } from 'boclips-api-client/dist/test-support/ThemeFactory';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/Theme';

describe('Theme Content', () => {
  let theme: Theme;

  beforeEach(() => {
    theme = ThemeFactory.sample({
      id: 'ducklings',
      provider: 'openstax',
      title: 'Everything to know about ducks',
      type: 'Essentials',
      topics: [
        {
          title: 'Chapter 1: Introduction',
          index: 0,
          targets: [
            {
              title: '1.1 Life at the coop',
              index: 0,
              videos: [],
              videoIds: [],
            },
            {
              title: '1.2 Adventures outside',
              index: 1,
              videos: [],
              videoIds: [],
            },
          ],
        },
        {
          title: 'Chapter 2: Epilogue',
          index: 1,
          targets: [
            {
              title: '2.1 This is the end',
              index: 0,
              videos: [],
              videoIds: [],
            },
          ],
        },
      ],
    });
  });

  it('by default renders only the first section of first chapter', () => {
    window.resizeTo(1500, 1024);

    const wrapper = renderWithClients(
      <ThemeMobileMenuProvider>
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <Content theme={theme} />
          <PaginationPanel theme={theme} />
        </AlignmentContextProvider>
      </ThemeMobileMenuProvider>,
    );

    const chapters = wrapper.getAllByRole('heading', { level: 2 });
    const sections = wrapper.getAllByRole('heading', { level: 3 });

    expect(chapters).toHaveLength(1);
    expect(chapters[0]).toBeVisible();
    expect(chapters[0]).toHaveTextContent('Chapter 1: Introduction');

    expect(sections).toHaveLength(1);
    expect(sections[0]).toBeVisible();
    expect(sections[0]).toHaveTextContent('1.1 Life at the coop (0 videos)');
  });

  it(`doesn't show previous chapter or previous section button on the first page`, () => {
    window.resizeTo(1500, 1024);

    const wrapper = renderWithClients(
      <ThemeMobileMenuProvider>
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <Content theme={theme} />
          <PaginationPanel theme={theme} />
        </AlignmentContextProvider>
      </ThemeMobileMenuProvider>,
    );

    expect(wrapper.queryByRole('link', { name: 'Previous' })).toBeNull();

    expect(wrapper.queryByRole('link', { name: 'Previous' })).toBeNull();
  });

  it('show previous section button when not on the first section', () => {
    window.resizeTo(1500, 1024);

    const wrapper = renderWithClients(
      <ThemeMobileMenuProvider>
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <Content theme={theme} />
          <PaginationPanel theme={theme} />
        </AlignmentContextProvider>
      </ThemeMobileMenuProvider>,
    );

    navigateTo(wrapper, 'Next');

    expect(
      wrapper.getByRole('link', {
        name: 'Previous 1.1 Life at the coop',
      }),
    ).toBeVisible();
  });

  it('show next section button when not on the last section', () => {
    window.resizeTo(1500, 1024);

    const wrapper = renderWithClients(
      <ThemeMobileMenuProvider>
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <Content theme={theme} />
          <PaginationPanel theme={theme} />
        </AlignmentContextProvider>
      </ThemeMobileMenuProvider>,
    );

    expect(
      wrapper.getByRole('link', {
        name: 'Next 1.2 Adventures outside',
      }),
    ).toBeVisible();
  });

  it(`doesn't show next chapter or next section button when on the last page`, () => {
    window.resizeTo(1500, 1024);

    const wrapper = renderWithClients(
      <ThemeMobileMenuProvider>
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <Content theme={theme} />
          <PaginationPanel theme={theme} />
        </AlignmentContextProvider>
      </ThemeMobileMenuProvider>,
    );

    navigateTo(wrapper, 'Next');
    navigateTo(wrapper, 'Next');

    expect(wrapper.queryByRole('link', { name: 'Next' })).toBeNull();
  });

  it(`show chapter navigation button instead of section ones when chapter change is possible`, () => {
    window.resizeTo(1500, 1024);

    const wrapper = renderWithClients(
      <ThemeMobileMenuProvider>
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <Content theme={theme} />
          <PaginationPanel theme={theme} />
        </AlignmentContextProvider>
      </ThemeMobileMenuProvider>,
    );

    navigateTo(wrapper, 'Next');
    expect(
      wrapper.getByRole('link', {
        name: 'Next Chapter 2: Epilogue',
      }),
    ).toBeVisible();

    navigateTo(wrapper, 'Next');

    const epilouge = chapterTitle(wrapper.container);
    expect(epilouge).toBeVisible();
    expect(epilouge.textContent).toBe('Chapter 2: Epilogue');

    expect(
      wrapper.getByRole('link', {
        name: 'Previous Chapter 1: Introduction',
      }),
    ).toBeVisible();

    navigateTo(wrapper, 'Previous');

    const introduction = chapterTitle(wrapper.container);
    expect(introduction).toBeVisible();
    expect(introduction.textContent).toBe('Chapter 1: Introduction');
  });
});
