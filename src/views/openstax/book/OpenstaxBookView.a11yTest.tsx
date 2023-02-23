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
          title: 'Chapter 1: Introduction',
          index: 0,
          sections: [
            {
              title: '1.1 Section 1',
              index: 0,
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
              title: '1.2 Section 2',
              index: 1,
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
          title: 'Chapter 2: Epilogue',
          index: 1,
          sections: [
            {
              title: '2.1 Section 1',
              index: 0,
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
              title: '2.2 Section 2',
              index: 1,
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

    const history = createBrowserHistory();
    history.push('/explore/openstax/ducklings');

    const wrapper = render(
      <Router location={history.location} navigator={history}>
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
