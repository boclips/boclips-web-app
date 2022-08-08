import { Book } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import { BookFactory } from 'boclips-api-client/dist/test-support/BookFactory';
import React from 'react';
import { renderWithClients } from 'src/testSupport/render';
import { OpenstaxBookContent } from 'src/components/openstax/book/OpenstaxBookContent';

describe('OpenstaxBookContent', () => {
  it('shows basic book content', () => {
    const book: Book = BookFactory.sample({
      id: 'ducklings',
      title: 'Everything to know about ducks',
      subject: 'Essentials',
      chapters: [
        {
          title: 'Introduction',
          number: 1,
          videos: [],
          videoIds: ['1'],
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
      ],
    });

    const wrapper = renderWithClients(<OpenstaxBookContent book={book} />);

    const chapter = wrapper.getByRole('heading', { level: 2 });
    const sections = wrapper.getAllByRole('heading', { level: 3 });

    expect(chapter).toBeVisible();
    expect(chapter).toHaveTextContent('Chapter 1: Introduction');

    expect(sections).toHaveLength(2);
    expect(sections[0]).toBeVisible();
    expect(sections[0]).toHaveTextContent('1.1 Life at the coop (0 videos)');
    expect(sections[1]).toBeVisible();
    expect(sections[1]).toHaveTextContent('1.2 Adventures outside (0 videos)');
  });
});
