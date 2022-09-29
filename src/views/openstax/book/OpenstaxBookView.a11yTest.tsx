import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { setUpClientWithBook } from 'src/views/openstax/book/OpenstaxBookTestSupport';
import { BookFactory } from 'boclips-api-client/dist/test-support/BookFactory';
import { Book } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';

describe('OpenstaxBookView - accessibility', () => {
  it('has no violations', async () => {
    const book: Book = BookFactory.sample({
      id: 'ducklings',
      title: 'Everything to know about ducks',
      subject: 'Essentials',
      chapters: [
        {
          title: 'Introduction',
          number: 1,
          sections: [
            {
              title: 'Section 1',
              number: 1,
              videos: [
                VideoFactory.sample({
                  id: '1',
                  title: 'The best video ever',
                  createdBy: 'TED',
                }),
              ],
              videoIds: ['1'],
            },
            {
              title: 'Section 2',
              number: 2,
              videos: [
                VideoFactory.sample({
                  id: '2',
                  title: 'The best video ever',
                  createdBy: 'TED',
                }),
              ],
              videoIds: ['2'],
            },
          ],
        },
        {
          title: 'Epilogue',
          number: 2,
          sections: [
            {
              title: 'Section 1',
              number: 1,
              videos: [
                VideoFactory.sample({
                  id: '3',
                  title: 'The best video ever',
                  createdBy: 'TED',
                }),
              ],
              videoIds: ['3'],
            },
            {
              title: 'Section 2',
              number: 2,
              videos: [
                VideoFactory.sample({
                  id: '4',
                  title: 'The best video ever',
                  createdBy: 'TED',
                }),
              ],
              videoIds: ['4'],
            },
          ],
        },
      ],
    });
    const client = setUpClientWithBook(book);

    const browserHistory = createBrowserHistory();
    browserHistory.push({ pathname: '/explore/openstax/ducklings' });
    const wrapper = render(
      <Router history={browserHistory}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </Router>,
    );

    expect(
      await wrapper.findByLabelText(
        `Content for Everything to know about ducks`,
      ),
    ).toBeVisible();

    const results = await axe(wrapper.container);

    expect(results).toHaveNoViolations();
  });
});
