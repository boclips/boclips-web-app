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
import { Book } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import {
  BookFactory,
  SectionFactory,
} from 'boclips-api-client/dist/test-support/BookFactory';
import { createBrowserHistory } from 'history';
import {
  resizeToDesktop,
  resizeToMobile,
  resizeToTablet,
} from 'src/testSupport/resizeTo';
import {
  createBook,
  getTableOfContent,
  setUpClientWithBook,
  validateVisibleHeadings,
} from 'src/views/openstax/book/OpenstaxBookTestSupport';
import { v4 as uuidv4 } from 'uuid';

describe('OpenstaxBookView', () => {
  it('renders loading skeletons before data is loaded', async () => {
    const book = createBook();

    const client = setUpClientWithBook(book);
    const wrapper = render(
      <MemoryRouter initialEntries={[`/explore/openstax/${book.id}`]}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await waitFor(() => wrapper.getByTestId('Loading details for book'));

    const loadingSkeleton = await wrapper.findByTestId(
      'Loading details for book',
    );

    expect(loadingSkeleton).not.toBeNull();
    expect(
      await wrapper.findByText('Everything to know about ducks'),
    ).toBeVisible();
    expect(loadingSkeleton).not.toBeInTheDocument();
  });

  it('shows Page not found when used non existing provider', async () => {
    resizeToDesktop();
    const book = createBook();

    const client = setUpClientWithBook(book);

    const wrapper = render(
      <MemoryRouter initialEntries={[`/explore/wrong-provider/${book.id}`]}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );
    expect(await wrapper.findByText('Page not found!')).toBeVisible();
  });

  it('by default renders book details with first chapter and first section selected', async () => {
    resizeToDesktop();
    const book = createBook();

    const client = setUpClientWithBook(book);

    const wrapper = render(
      <MemoryRouter initialEntries={[`/explore/openstax/${book.id}`]}>
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
      'Chapter Overview',
      'Discussion Prompt',
      '1.1 Life at the coop',
      '1.2 Adventures outside',
    ]);
  });

  it('renders second section when selected', async () => {
    resizeToDesktop();
    const book = createBook();

    const client = setUpClientWithBook(book);

    const wrapper = render(
      <MemoryRouter initialEntries={[`/explore/openstax/${book.id}`]}>
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
      wrapper.getByText(
        "We don't have any videos for this section yet. We're working on it!",
      ),
    ).toBeVisible();
  });

  it('renders second chapter when selected', async () => {
    resizeToDesktop();
    const book = createBook();

    const client = setUpClientWithBook(book);

    const wrapper = render(
      <MemoryRouter initialEntries={[`/explore/openstax/${book.id}`]}>
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
    const book: Book = BookFactory.sample({
      id: uuidv4(),
      title: 'Everything to know about ducks',
      subject: 'Essentials',
      chapters: [
        {
          title: 'Chapter 1: Introduction',
          index: 0,
          sections: [
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
    const client = setUpClientWithBook(book);

    const wrapper = render(
      <MemoryRouter initialEntries={[`/explore/openstax/${book.id}`]}>
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
    const book = createBook();

    const client = setUpClientWithBook(book);

    const wrapper = render(
      <MemoryRouter initialEntries={[`/explore/openstax/${book.id}`]}>
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

    expect(
      await wrapper.container.querySelector(
        `#${chapter1OverviewNavigationLabel}-nav`,
      ),
    ).not.toBeNull();
  });

  it('hashes match for discussion prompt in navigation panel and content panel', async () => {
    resizeToDesktop();
    const book = createBook();

    const client = setUpClientWithBook(book);

    const wrapper = render(
      <MemoryRouter initialEntries={[`/explore/openstax/${book.id}`]}>
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
    const book = createBook();

    const client = setUpClientWithBook(book);

    const wrapper = render(
      <MemoryRouter initialEntries={[`/explore/openstax/${book.id}`]}>
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
    const book = createBook();

    const client = setUpClientWithBook(book);

    render(
      <MemoryRouter initialEntries={[`/explore/openstax/${book.id}`]}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );
  });

  it('renders first available chapter when the hash is outdated or not matching a section', async () => {
    const book = createBook();

    const client = setUpClientWithBook(book);

    const wrapper = render(
      <MemoryRouter
        initialEntries={[`/explore/openstax/${book.id}#chapter-blabla`]}
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
      const book: Book = BookFactory.sample({
        id: uuidv4(),
        title: 'Everything to know about ducks',
        subject: 'Essentials',
        chapters: [
          {
            title: 'Chapter 1: Introduction',
            index: 0,
            sections: [SectionFactory.sample()],
          },
        ],
      });

      it('renders back button', async () => {
        resize();
        const client = setUpClientWithBook(book);

        const wrapper = render(
          <MemoryRouter initialEntries={[`/explore/openstax/${book.id}`]}>
            <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
          </MemoryRouter>,
        );

        expect(
          await wrapper.findByRole('button', { name: 'Back' }),
        ).toBeVisible();
      });

      it(`navigates back to explore page when clicked`, async () => {
        resize();
        const client = setUpClientWithBook(book);

        const history = createBrowserHistory();
        history.replace(`/explore/openstax/${book.id}`);

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

        expect(history.location.pathname).toEqual('/explore/openstax');
      });
    },
  );

  describe('mobile/tablet view', () => {
    beforeEach(() => {
      resizeToTablet();
    });

    it('will show the navigation view when clicking course content button', async () => {
      const book: Book = BookFactory.sample({
        id: uuidv4(),
        title: 'All about ducks',
      });

      const wrapper = renderBookView(book);

      const courseContentButton = await wrapper.findByRole('button', {
        name: 'Course content',
      });

      expect(getTableOfContent(book, wrapper)).toBeNull();

      fireEvent.click(courseContentButton);

      expect(getTableOfContent(book, wrapper)).toBeVisible();
    });

    it('will close the navigation view, if close is clicked', async () => {
      const book: Book = BookFactory.sample({
        id: uuidv4(),
        title: 'All about ducks',
      });

      const wrapper = renderBookView(book);

      const courseContentButton = await wrapper.findByRole('button', {
        name: 'Course content',
      });

      fireEvent.click(courseContentButton);

      const closeTableOfContent = wrapper.getByRole('button', {
        name: 'Close the Table of contents',
      });

      fireEvent.click(closeTableOfContent);
      expect(getTableOfContent(book, wrapper)).toBeNull();
    });

    it('back button is not visible in course content panel', async () => {
      const book: Book = BookFactory.sample({
        id: uuidv4(),
        title: 'All about ducks',
      });

      const wrapper = renderBookView(book);

      const courseContentButton = await wrapper.findByRole('button', {
        name: 'Course content',
      });
      fireEvent.click(courseContentButton);

      const tableOfContentPanel = await wrapper.getByTestId(
        'table of contents panel',
      );

      expect(
        await within(tableOfContentPanel).queryByRole('button', {
          name: 'Back',
        }),
      ).toBeNull();
    });
  });
});

const renderBookView = (book: Book): RenderResult => {
  const client = new FakeBoclipsClient();
  client.users.setCurrentUserFeatures({ BO_WEB_APP_OPENSTAX: true });
  client.openstax.setOpenstaxBooks([book]);
  return render(
    <MemoryRouter initialEntries={[`/explore/openstax/${book.id}`]}>
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
