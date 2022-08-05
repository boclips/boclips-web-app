import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import { Book } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { BookFactory } from 'boclips-api-client/dist/test-support/BookFactory';

describe('OpenstaxBookView', () => {
  it('renders basic book details', async () => {
    const client = new FakeBoclipsClient();

    const book: Book = BookFactory.sample({
      id: 'ducklings',
      title: 'Everything to know about ducks',
      subject: 'Essentials',
      chapters: [
        {
          title: 'Introduction',
          number: 1,
          videos: [VideoFactory.sample({ title: 'This video will be hidden' })],
          videoIds: ['1'],
          sections: [
            {
              title: 'Life at the coop',
              number: 1,
              videos: [VideoFactory.sample({ title: 'Baby ducks playing' })],
              videoIds: ['2'],
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

    client.openstax.setOpenstaxBooks([book]);

    const wrapper = render(
      <MemoryRouter initialEntries={['/explore/openstax/ducklings']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    const titles = await wrapper.findAllByRole('heading', {
      level: 1,
      name: 'Everything to know about ducks',
    });
    const chapters = wrapper.getAllByRole('heading', { level: 2 });
    const sections = wrapper.getAllByRole('heading', { level: 3 });

    expect(titles).toHaveLength(2);
    expect(titles[0]).toBeVisible();
    expect(titles[1]).toBeVisible();

    expect(chapters).toHaveLength(2);
    expect(chapters[0]).toBeVisible();
    expect(chapters[1]).toBeVisible();
    expect(chapters[0]).toHaveTextContent('Chapter 1: Introduction');
    expect(chapters[1]).toHaveTextContent('Chapter 1: Introduction');

    expect(sections).toHaveLength(4);
    expect(sections[0]).toBeVisible();
    expect(sections[0]).toHaveTextContent('1.1 Life at the coop');
    expect(sections[1]).toBeVisible();
    expect(sections[1]).toHaveTextContent('1.2 Adventures outside');

    expect(sections[2]).toBeVisible();
    expect(sections[2]).toHaveTextContent('1.1 Life at the coop');
    expect(sections[3]).toBeVisible();
    expect(sections[3]).toHaveTextContent('1.2 Adventures outside');

    expect(
      wrapper.getByText(
        "We don't have any videos for this section yet. We're working on it!",
      ),
    ).toBeVisible();
  });

  it('renders section video cards with only thumbnail', async () => {
    const client = new FakeBoclipsClient();
    const videoTitle = 'Baby ducks playing';
    const book: Book = BookFactory.sample({
      id: 'ducklings',
      title: 'Everything to know about ducks',
      subject: 'Essentials',
      chapters: [
        {
          title: 'Introduction',
          number: 1,
          videos: [],
          videoIds: [],
          sections: [
            {
              title: 'Life at the coop',
              number: 1,
              videos: [
                VideoFactory.sample({
                  title: videoTitle,
                  createdBy: 'Farmer Joe',
                }),
              ],
              videoIds: ['2'],
            },
          ],
        },
      ],
    });

    client.openstax.setOpenstaxBooks([book]);

    const wrapper = render(
      <MemoryRouter initialEntries={['/explore/openstax/ducklings']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(
      await wrapper.findByLabelText(`${videoTitle} grid card`),
    ).toBeVisible();

    const playableThumbnail = wrapper.getByRole('button', {
      name: `play ${videoTitle}`,
    });
    expect(playableThumbnail).toBeVisible();

    expect(wrapper.getByText('Farmer Joe')).toBeVisible();
  });
});
