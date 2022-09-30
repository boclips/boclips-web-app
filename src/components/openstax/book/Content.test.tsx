import React from 'react';
import { renderWithClients } from 'src/testSupport/render';
import { Content } from 'src/components/openstax/book/Content';
import { OpenstaxBookFactory } from 'src/testSupport/OpenstaxBookFactory';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { OpenstaxMobileMenuProvider } from 'src/components/common/providers/OpenstaxMobileMenuProvider';
import {
  chapterTitle,
  navigateTo,
} from 'src/views/openstax/book/OpenstaxBookTestSupport';

describe('OpenstaxBookContent', () => {
  let book: OpenstaxBook;

  beforeEach(() => {
    book = OpenstaxBookFactory.sample({
      id: 'ducklings',
      title: 'Everything to know about ducks',
      subject: 'Essentials',
      chapters: [
        {
          title: 'Introduction',
          number: 1,
          sections: [
            {
              title: 'Life at the coop',
              number: 1,
              videos: [],
              videoIds: [],
            },
            {
              title: 'Adventures outside',
              number: 2,
              videos: [],
              videoIds: [],
            },
          ],
        },
        {
          title: 'Epilogue',
          number: 2,
          sections: [
            {
              title: 'This is the end',
              number: 1,
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
      <OpenstaxMobileMenuProvider>
        <Content book={book} />
      </OpenstaxMobileMenuProvider>,
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
      <OpenstaxMobileMenuProvider>
        <Content book={book} />
      </OpenstaxMobileMenuProvider>,
    );

    expect(
      wrapper.queryByRole('link', { name: 'Previous chapter' }),
    ).toBeNull();

    expect(
      wrapper.queryByRole('link', { name: 'Previous section' }),
    ).toBeNull();
  });

  it('show previous section button when not on the first section', () => {
    window.resizeTo(1500, 1024);

    const wrapper = renderWithClients(
      <OpenstaxMobileMenuProvider>
        <Content book={book} />
      </OpenstaxMobileMenuProvider>,
    );

    navigateTo(wrapper, 'Next section');

    expect(
      wrapper.getByRole('link', {
        name: 'Previous section 1.1 Life at the coop',
      }),
    ).toBeVisible();
  });

  it('show next section button when not on the last section', () => {
    window.resizeTo(1500, 1024);

    const wrapper = renderWithClients(
      <OpenstaxMobileMenuProvider>
        <Content book={book} />
      </OpenstaxMobileMenuProvider>,
    );

    expect(
      wrapper.getByRole('link', {
        name: 'Next section 1.2 Adventures outside',
      }),
    ).toBeVisible();
  });

  it(`doesn't show next chapter or next section button when on the last page`, () => {
    window.resizeTo(1500, 1024);

    const wrapper = renderWithClients(
      <OpenstaxMobileMenuProvider>
        <Content book={book} />
      </OpenstaxMobileMenuProvider>,
    );

    navigateTo(wrapper, 'Next section');
    navigateTo(wrapper, 'Next chapter');

    expect(wrapper.queryByRole('link', { name: 'Next chapter' })).toBeNull();
    expect(wrapper.queryByRole('link', { name: 'Next section' })).toBeNull();
  });

  it(`show chapter navigation button instead of section ones when chapter change is possible`, () => {
    window.resizeTo(1500, 1024);

    const wrapper = renderWithClients(
      <OpenstaxMobileMenuProvider>
        <Content book={book} />
      </OpenstaxMobileMenuProvider>,
    );

    navigateTo(wrapper, 'Next section');
    expect(
      wrapper.getByRole('link', {
        name: 'Next chapter Chapter 2: Epilogue',
      }),
    ).toBeVisible();

    navigateTo(wrapper, 'Next chapter');

    const epilouge = chapterTitle(wrapper.container);
    expect(epilouge).toBeVisible();
    expect(epilouge.textContent).toBe('Chapter 2: Epilogue');

    expect(
      wrapper.getByRole('link', {
        name: 'Previous chapter Chapter 1: Introduction',
      }),
    ).toBeVisible();

    navigateTo(wrapper, 'Previous chapter');

    const introduction = chapterTitle(wrapper.container);
    expect(introduction).toBeVisible();
    expect(introduction.textContent).toBe('Chapter 1: Introduction');
  });
});
