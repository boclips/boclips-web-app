import React from 'react';
import { renderWithClients } from 'src/testSupport/render';
import { Content } from 'src/components/openstax/book/Content';
import { OpenstaxBookFactory } from 'src/testSupport/OpenstaxBookFactory';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { OpenstaxMobileMenuProvider } from 'src/components/common/providers/OpenstaxMobileMenuProvider';
import { fireEvent } from '@testing-library/react';

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

  it('by default renders only the first chapter', () => {
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

    expect(sections).toHaveLength(2);
    expect(sections[0]).toBeVisible();
    expect(sections[0]).toHaveTextContent('1.1 Life at the coop (0 videos)');
    expect(sections[1]).toBeVisible();
    expect(sections[1]).toHaveTextContent('1.2 Adventures outside (0 videos)');
  });

  it(`doesn't show previous chapter button on the first page`, () => {
    window.resizeTo(1500, 1024);

    const wrapper = renderWithClients(
      <OpenstaxMobileMenuProvider>
        <Content book={book} />
      </OpenstaxMobileMenuProvider>,
    );

    expect(
      wrapper.queryByRole('link', { name: 'Previous Chapter' }),
    ).toBeNull();
  });

  it('show previous chapter button when not on the first chapter', () => {
    window.resizeTo(1500, 1024);

    const wrapper = renderWithClients(
      <OpenstaxMobileMenuProvider>
        <Content book={book} />
      </OpenstaxMobileMenuProvider>,
    );

    const nextChapterButton = wrapper.getByRole('link', {
      name: 'Next Chapter',
    });

    fireEvent.click(nextChapterButton);

    expect(
      wrapper.getByRole('link', { name: 'Previous Chapter' }),
    ).toBeVisible();
  });

  it('show next chapter button when not on the last chapter', () => {
    window.resizeTo(1500, 1024);

    const wrapper = renderWithClients(
      <OpenstaxMobileMenuProvider>
        <Content book={book} />
      </OpenstaxMobileMenuProvider>,
    );

    expect(wrapper.getByRole('link', { name: 'Next Chapter' })).toBeVisible();
  });

  it(`doesn't show next chapter button when on the last chapter`, () => {
    window.resizeTo(1500, 1024);

    const wrapper = renderWithClients(
      <OpenstaxMobileMenuProvider>
        <Content book={book} />
      </OpenstaxMobileMenuProvider>,
    );

    const nextChapterButton = wrapper.getByRole('link', {
      name: 'Next Chapter',
    });
    fireEvent.click(nextChapterButton);

    expect(wrapper.queryByRole('link', { name: 'Next Chapter' })).toBeNull();
  });
});
