import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { ChapterElement } from 'src/components/openstax/book/ChapterElement';
import React from 'react';
import { Video } from 'boclips-api-client/dist/types';
import { renderWithClients } from 'src/testSupport/render';

describe('OpenstaxChapterElement', () => {
  it.each([
    [0, '(0 videos)'],
    [1, '(1 video)'],
    [3, '(3 videos)'],
  ])(
    'renders section title with %i video(s)',
    (numberOfVideos: number, expectedVideoNumberLabel: string) => {
      const videos: Video[] = [];
      for (let i = 0; i < numberOfVideos; i++) {
        videos.push(VideoFactory.sample({ id: `video-id-${i}` }));
      }

      const wrapper = renderWithClients(
        <ChapterElement
          info={{
            displayLabel: '2.1 Life at the coop ',
            videos,
            id: 'section-2.1',
          }}
        />,
      );

      const sectionTitle = wrapper.getByRole('heading', { level: 3 });

      expect(sectionTitle).toBeVisible();
      expect(sectionTitle).toHaveTextContent('2.1 Life at the coop ');
      expect(sectionTitle).toHaveTextContent(expectedVideoNumberLabel);
    },
  );

  it('renders video cards when they are mapped to the section', () => {
    const videoTitle = 'Ducklings playing with hay';

    const wrapper = renderWithClients(
      <ChapterElement
        info={{
          displayLabel: '2.1 Life at the coop ',
          videos: [
            VideoFactory.sample({
              title: videoTitle,
              createdBy: 'Aunt Mary',
            }),
          ],
          id: 'section-2.1',
        }}
      />,
    );

    const playableThumbnail = wrapper.getByRole('button', {
      name: `play ${videoTitle}`,
    });
    expect(playableThumbnail).toBeVisible();
    expect(wrapper.getByLabelText(`${videoTitle} grid card`)).toBeVisible();
    expect(wrapper.getByText('Aunt Mary')).toBeVisible();
  });

  it('renders messaging when no videos are mapped to the section', () => {
    const wrapper = renderWithClients(
      <ChapterElement
        info={{
          displayLabel: '2.1 Life at the coop ',
          videos: [],
          id: 'section-2.1',
        }}
      />,
    );

    expect(
      wrapper.getByText(
        "We don't have any videos for this section yet. We're working on it!",
      ),
    ).toBeVisible();
  });
});
