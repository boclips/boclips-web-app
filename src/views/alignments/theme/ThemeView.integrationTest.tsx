import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
  within,
} from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import App from 'src/App';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { createBrowserHistory } from 'history';
import {
  resizeToDesktop,
  resizeToMobile,
  resizeToTablet,
} from 'src/testSupport/resizeTo';
import {
  createTheme,
  getTableOfContent,
  setUpClientWithTheme,
  validateVisibleHeadings,
} from 'src/views/alignments/theme/ThemeTestSupport';
import { v4 as uuidv4 } from 'uuid';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/theme/Theme';
import {
  TargetFactory,
  ThemeFactory,
} from 'boclips-api-client/dist/test-support/ThemeFactory';
import userEvent from '@testing-library/user-event';
import { ProviderFactory } from 'src/views/alignments/provider/ProviderFactory';

describe('ThemeView', () => {
  it('renders loading skeletons before data is loaded', async () => {
    const theme = createTheme();

    const client = setUpClientWithTheme(theme);
    const wrapper = render(
      <MemoryRouter initialEntries={[`/sparks/openstax/${theme.id}`]}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await waitFor(() => wrapper.getByTestId('Loading details for theme'));

    const loadingSkeleton = await wrapper.findByTestId(
      'Loading details for theme',
    );

    expect(loadingSkeleton).not.toBeNull();
    expect(
      await wrapper.findByText('Everything to know about ducks'),
    ).toBeVisible();
    expect(loadingSkeleton).not.toBeInTheDocument();
  });

  it('shows Page not found when used non existing provider', async () => {
    resizeToDesktop();
    const theme = createTheme();

    const client = setUpClientWithTheme(theme);

    const wrapper = render(
      <MemoryRouter initialEntries={[`/sparks/wrong-provider/${theme.id}`]}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );
    expect(await wrapper.findByText('Page not found!')).toBeVisible();
  });

  it('shows Page not found when used provider not matched to theme', async () => {
    resizeToDesktop();
    const openstaxTheme = createTheme();

    const client = setUpClientWithTheme(openstaxTheme);
    client.alignments.setThemesByProvider({
      providerName: 'common-core-math',
      themes: [],
    });

    const wrapper = render(
      <MemoryRouter
        initialEntries={[`/sparks/common-core-math/${openstaxTheme.id}`]}
      >
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );
    expect(await wrapper.findByText('Page not found!')).toBeVisible();
  });

  it('by default renders book details with first chapter and first section selected', async () => {
    resizeToDesktop();
    const theme = createTheme();

    const client = setUpClientWithTheme(theme);

    const wrapper = render(
      <MemoryRouter initialEntries={[`/sparks/openstax/${theme.id}`]}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    const titles = await wrapper.findAllByRole('heading', {
      level: 1,
      name: /Everything to know about ducks/,
    });

    expect(titles).toHaveLength(2);
    expect(titles[0]).toBeVisible();
    expect(titles[1]).toBeVisible();

    const bookDetails = wrapper.getByLabelText(
      'Content for Everything to know about ducks',
    );

    expect(bookDetails).toBeVisible();

    validateVisibleHeadings(bookDetails, 2, ['Chapter 1: Introduction']);

    fireEvent.click(wrapper.getByText('Chapter Overview'));

    validateVisibleHeadings(bookDetails, 3, ['Chapter Overview (1 video)']);

    const bookToc = wrapper.getByLabelText(
      'Table of contents of Everything to know about ducks',
    );
    expect(bookToc).toBeVisible();
    validateVisibleHeadings(bookToc, 2, [
      'Chapter 1: Introduction',
      'Chapter 2: Epilogue',
    ]);
    validateVisibleHeadings(bookToc, 3, [
      '1.1 Life at the coop',
      '1.2 Adventures outside',
      'Chapter Overview',
      'Discussion Prompt',
    ]);
  });

  it('renders second section when selected', async () => {
    resizeToDesktop();
    const book = createTheme();

    const client = setUpClientWithTheme(book);

    const wrapper = render(
      <MemoryRouter initialEntries={[`/sparks/openstax/${book.id}`]}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    const sectionLink = await wrapper.findByRole('link', {
      name: '1.2 Adventures outside',
    });

    expect(sectionLink).toBeVisible();

    fireEvent.click(sectionLink);

    const titles = await wrapper.findAllByRole('heading', {
      level: 1,
      name: /Everything to know about ducks/,
    });

    expect(titles).toHaveLength(2);
    expect(titles[0]).toBeVisible();
    expect(titles[1]).toBeVisible();

    const bookDetails = wrapper.getByLabelText(
      'Content for Everything to know about ducks',
    );

    expect(bookDetails).toBeVisible();
    validateVisibleHeadings(bookDetails, 2, ['Chapter 1: Introduction']);
    validateVisibleHeadings(bookDetails, 3, [
      '1.2 Adventures outside (0 videos)',
    ]);

    expect(
      wrapper.getByText('We’re working on it! These videos are coming soon!'),
    ).toBeVisible();
  });

  it('renders second chapter when selected', async () => {
    resizeToDesktop();
    const book = createTheme();

    const client = setUpClientWithTheme(book);

    const wrapper = render(
      <MemoryRouter initialEntries={[`/sparks/openstax/${book.id}`]}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    const chapter2NavigationButton = await wrapper.findByRole('button', {
      name: 'Chapter 2: Epilogue',
    });

    fireEvent.click(chapter2NavigationButton);

    const sectionLink = wrapper.getByRole('link', {
      name: '2.1 This is the end',
    });

    expect(sectionLink).toBeVisible();

    fireEvent.click(sectionLink);

    const bookDetails = wrapper.getByLabelText(
      'Content for Everything to know about ducks',
    );

    expect(bookDetails).toBeVisible();
    validateVisibleHeadings(bookDetails, 2, ['Chapter 2: Epilogue']);
    validateVisibleHeadings(bookDetails, 3, ['2.1 This is the end (1 video)']);
  });

  it('renders section video cards with only thumbnail', async () => {
    resizeToDesktop();
    const theme: Theme = ThemeFactory.sample({
      id: uuidv4(),
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
              videos: [
                VideoFactory.sample({
                  title: 'Baby ducks playing',
                  createdBy: 'Farmer Joe',
                }),
              ],
              videoIds: ['2'],
            },
          ],
        },
      ],
    });
    const client = setUpClientWithTheme(theme);

    const wrapper = render(
      <MemoryRouter initialEntries={[`/sparks/openstax/${theme.id}`]}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(
      await wrapper.findByLabelText(`Baby ducks playing grid card`),
    ).toBeVisible();

    const playableThumbnail = wrapper.getByRole('button', {
      name: `play Baby ducks playing`,
    });
    expect(playableThumbnail).toBeVisible();

    expect(wrapper.getByText('Farmer Joe')).toBeVisible();
  });

  it('hashes match for chapter overview in navigation panel and content panel', async () => {
    resizeToDesktop();
    const book = createTheme();

    const client = setUpClientWithTheme(book);

    const wrapper = render(
      <MemoryRouter initialEntries={[`/sparks/openstax/${book.id}`]}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    const titles = await wrapper.findAllByRole('heading', {
      level: 1,
      name: /Everything to know about ducks/,
    });
    expect(titles).toHaveLength(2);

    const chapter1OverviewNavigationLabel = getNavigationLabel(
      wrapper,
      'Chapter Overview',
    );

    await userEvent.click(wrapper.getByText('Chapter Overview'));

    expect(
      wrapper.container.querySelector(`#${chapter1OverviewNavigationLabel}`),
    ).not.toBeNull();
  });

  it('hashes match for discussion prompt in navigation panel and content panel', async () => {
    resizeToDesktop();
    const book = createTheme();

    const client = setUpClientWithTheme(book);

    const wrapper = render(
      <MemoryRouter initialEntries={[`/sparks/openstax/${book.id}`]}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    const titles = await wrapper.findAllByRole('heading', {
      level: 1,
      name: /Everything to know about ducks/,
    });
    expect(titles).toHaveLength(2);

    const discussionPromptLink = wrapper.getByRole('link', {
      name: 'Discussion Prompt',
    });
    fireEvent.click(discussionPromptLink);

    const chapter1DiscussionPromptNavigationLabel = getNavigationLabel(
      wrapper,
      'Discussion Prompt',
    );

    expect(
      await wrapper.container.querySelector(
        `#${chapter1DiscussionPromptNavigationLabel}`,
      ),
    ).not.toBeNull();
  });

  it('hashes match for section in navigation panel and content panel', async () => {
    resizeToDesktop();
    const book = createTheme();

    const client = setUpClientWithTheme(book);

    const wrapper = render(
      <MemoryRouter initialEntries={[`/sparks/openstax/${book.id}`]}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    const titles = await wrapper.findAllByRole('heading', {
      level: 1,
      name: /Everything to know about ducks/,
    });
    expect(titles).toHaveLength(2);

    const sectionLink = wrapper.getByRole('link', {
      name: '1.1 Life at the coop',
    });
    fireEvent.click(sectionLink);

    const chapter1Section1NavigationLabel = getNavigationLabel(
      wrapper,
      '1.1 Life at the coop',
    );

    expect(
      await wrapper.container.querySelector(
        `#${chapter1Section1NavigationLabel}`,
      ),
    ).not.toBeNull();
  });

  it('renders book title as page title', async () => {
    const book = createTheme();

    const client = setUpClientWithTheme(book);

    render(
      <MemoryRouter initialEntries={[`/sparks/openstax/${book.id}`]}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );
  });

  it('renders first available chapter when the hash is outdated or not matching a section', async () => {
    const book = createTheme();

    const client = setUpClientWithTheme(book);

    const wrapper = render(
      <MemoryRouter
        initialEntries={[`/sparks/openstax/${book.id}#topic-blabla`]}
      >
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('1.1 Life at the coop')).toBeVisible();
  });

  describe.each([
    ['desktop', resizeToDesktop],
    ['tablet', resizeToTablet],
    ['mobile', resizeToMobile],
  ])(
    'back button to explore page on %s',
    (_deviceType: string, resize: () => void) => {
      const theme: Theme = ThemeFactory.sample({
        id: uuidv4(),
        provider: 'openstax',
        title: 'Everything to know about ducks',
        type: 'Essentials',
        topics: [
          {
            title: 'Chapter 1: Introduction',
            index: 0,
            targets: [TargetFactory.sample()],
          },
        ],
      });

      it('renders back button', async () => {
        resize();
        const client = setUpClientWithTheme(theme);

        const wrapper = render(
          <MemoryRouter initialEntries={[`/sparks/openstax/${theme.id}`]}>
            <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
          </MemoryRouter>,
        );

        expect(
          await wrapper.findByRole('button', { name: 'Back' }),
        ).toBeVisible();
      });

      it(`navigates back to explore page when clicked`, async () => {
        resize();
        const client = setUpClientWithTheme(theme);

        const history = createBrowserHistory();
        history.replace(`/sparks/openstax/${theme.id}`);

        const wrapper = render(
          <Router location={history.location} navigator={history}>
            <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
          </Router>,
        );

        await waitFor(() =>
          wrapper.getAllByText('Everything to know about ducks'),
        );

        const backButton = await wrapper.findByRole('button', { name: 'Back' });

        fireEvent.click(backButton);

        expect(history.location.pathname).toEqual('/sparks/openstax');
      });
    },
  );

  describe('mobile/tablet view', () => {
    beforeEach(() => {
      resizeToTablet();
    });

    it('will show the navigation view when clicking course content button', async () => {
      const theme: Theme = ThemeFactory.sample({
        id: uuidv4(),
        title: 'All about ducks',
        provider: 'openstax',
      });

      const wrapper = renderThemeView(theme);

      const courseContentButton = await wrapper.findByRole('button', {
        name: 'Course content',
      });

      expect(getTableOfContent(theme, wrapper)).toBeNull();

      fireEvent.click(courseContentButton);

      expect(getTableOfContent(theme, wrapper)).toBeVisible();
    });

    it('will close the navigation view, if close is clicked', async () => {
      const theme: Theme = ThemeFactory.sample({
        id: uuidv4(),
        title: 'All about ducks',
        provider: 'openstax',
      });

      const wrapper = renderThemeView(theme);

      const courseContentButton = await wrapper.findByRole('button', {
        name: 'Course content',
      });

      fireEvent.click(courseContentButton);

      const closeTableOfContent = wrapper.getByRole('button', {
        name: 'Close the Table of contents',
      });

      fireEvent.click(closeTableOfContent);
      expect(getTableOfContent(theme, wrapper)).toBeNull();
    });

    it('back button is not visible in course content panel', async () => {
      const theme: Theme = ThemeFactory.sample({
        id: uuidv4(),
        title: 'All about ducks',
        provider: 'openstax',
      });

      const wrapper = renderThemeView(theme);

      const courseContentButton = await wrapper.findByRole('button', {
        name: 'Course content',
      });
      fireEvent.click(courseContentButton);

      const tableOfContentPanel = wrapper.getByTestId(
        'table of contents panel',
      );

      expect(
        within(tableOfContentPanel).queryByRole('button', { name: 'Back' }),
      ).toBeNull();
    });
  });
});

const renderThemeView = (theme: Theme): RenderResult => {
  const client = new FakeBoclipsClient();
  client.alignments.setThemesByProvider({
    providerName: 'openstax',
    themes: [theme],
  });
  client.alignments.setProviders([
    ProviderFactory.sample('openstax', {
      types: [theme.type],
    }),
  ]);
  return render(
    <MemoryRouter initialEntries={[`/sparks/openstax/${theme.id}`]}>
      <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
    </MemoryRouter>,
  );
};

const getNavigationLabel = (wrapper: RenderResult, sectionTitle: string) => {
  return wrapper
    .getByRole('link', { name: sectionTitle })
    .getAttribute('href')
    .split('#')[1];
};
