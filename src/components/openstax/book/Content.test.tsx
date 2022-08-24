import React from 'react';
import { renderWithClients } from 'src/testSupport/render';
import { Content } from 'src/components/openstax/book/Content';
import { OpenstaxBookFactory } from 'src/testSupport/OpenstaxBookFactory';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { OpenstaxMobileMenuProvider } from 'src/components/common/providers/OpenstaxMobileMenuProvider';

describe('OpenstaxBookContent', () => {
  it('shows basic book content', () => {
    window.resizeTo(1500, 1024);

    const book: OpenstaxBook = OpenstaxBookFactory.sample({
      id: 'ducklings',
      title: 'Everything to know about ducks',
      subject: 'Essentials',
      chapters: [
        {
          title: 'Introduction',
          number: 1,
          videos: [VideoFactory.sample({})],
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

    const wrapper = renderWithClients(
      <OpenstaxMobileMenuProvider>
        <Content book={book} />
      </OpenstaxMobileMenuProvider>,
    );

    const chapter = wrapper.getByRole('heading', { level: 2 });
    const sections = wrapper.getAllByRole('heading', { level: 3 });

    expect(chapter).toBeVisible();
    expect(chapter).toHaveTextContent('Chapter 1: Introduction');

    expect(sections).toHaveLength(3);
    expect(sections[0]).toBeVisible();
    expect(sections[0]).toHaveTextContent('Chapter overview');
    expect(sections[1]).toBeVisible();
    expect(sections[1]).toHaveTextContent('1.1 Life at the coop (0 videos)');
    expect(sections[2]).toBeVisible();
    expect(sections[2]).toHaveTextContent('1.2 Adventures outside (0 videos)');
  });
});
