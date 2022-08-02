import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { Section } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import { SectionFactory } from 'boclips-api-client/dist/test-support/BookFactory';
import { OpenstaxBookSection } from 'src/components/openstax/book/OpenstaxBookSection';
import React from 'react';
import { Video } from 'boclips-api-client/dist/types';
import { renderWithClients } from 'src/testSupport/render';

describe('OpenstaxBookSection', () => {
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

      const section: Section = SectionFactory.sample({
        title: 'Life at the coop',
        number: 1,
        videos,
        videoIds: videos.map((video) => video.id),
      });

      const wrapper = renderWithClients(
        <OpenstaxBookSection section={section} chapterNumber={2} />,
      );

      const sectionTitle = wrapper.getByRole('heading', { level: 3 });

      expect(sectionTitle).toBeVisible();
      expect(sectionTitle).toHaveTextContent('2.1 Life at the coop ');
      expect(sectionTitle).toHaveTextContent(expectedVideoNumberLabel);
    },
  );

  it('renders video cards when they are mapped to the section', () => {
    const videoTitle = 'Ducklings playing with hay';
    const section: Section = SectionFactory.sample({
      videos: [
        VideoFactory.sample({
          title: videoTitle,
          createdBy: 'Aunt Mary',
        }),
      ],
    });

    const wrapper = renderWithClients(
      <OpenstaxBookSection section={section} chapterNumber={2} />,
    );

    const playableThumbnail = wrapper.getByRole('button', {
      name: `play ${videoTitle}`,
    });
    expect(playableThumbnail).toBeVisible();
    expect(wrapper.getByLabelText(`${videoTitle} grid card`)).toBeVisible();
    expect(wrapper.getByText('Aunt Mary')).toBeVisible();
  });

  it('renders messaging when no videos are mapped to the section', () => {
    const section: Section = SectionFactory.sample({
      videos: [],
    });

    const wrapper = renderWithClients(
      <OpenstaxBookSection section={section} chapterNumber={2} />,
    );

    expect(
      wrapper.getByText(
        "We don't have any videos for this section yet. We're working on it!",
      ),
    ).toBeVisible();
  });
});
