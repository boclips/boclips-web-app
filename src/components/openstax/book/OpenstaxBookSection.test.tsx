import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { OpenstaxBookSection } from 'src/components/openstax/book/OpenstaxBookSection';
import React from 'react';
import { Video } from 'boclips-api-client/dist/types';
import { renderWithClients } from 'src/testSupport/render';
import { OpenstaxSectionFactory } from 'src/testSupport/OpenstaxSectionFactory';
import { OpenstaxSection } from 'src/types/OpenstaxBook';

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

      const section: OpenstaxSection = OpenstaxSectionFactory.sample(2, {
        title: 'Life at the coop',
        number: 1,
        videos,
        videoIds: videos.map((video) => video.id),
      });

      const wrapper = renderWithClients(
        <OpenstaxBookSection section={section} />,
      );

      const sectionTitle = wrapper.getByRole('heading', { level: 3 });

      expect(sectionTitle).toBeVisible();
      expect(sectionTitle).toHaveTextContent('2.1 Life at the coop ');
      expect(sectionTitle).toHaveTextContent(expectedVideoNumberLabel);
    },
  );

  it('renders video cards when they are mapped to the section', () => {
    const videoTitle = 'Ducklings playing with hay';
    const section: OpenstaxSection = OpenstaxSectionFactory.sample(2, {
      videos: [
        VideoFactory.sample({
          title: videoTitle,
          createdBy: 'Aunt Mary',
        }),
      ],
    });

    const wrapper = renderWithClients(
      <OpenstaxBookSection section={section} />,
    );

    const playableThumbnail = wrapper.getByRole('button', {
      name: `play ${videoTitle}`,
    });
    expect(playableThumbnail).toBeVisible();
    expect(wrapper.getByLabelText(`${videoTitle} grid card`)).toBeVisible();
    expect(wrapper.getByText('Aunt Mary')).toBeVisible();
  });

  it('renders messaging when no videos are mapped to the section', () => {
    const section: OpenstaxSection = OpenstaxSectionFactory.sample(2, {
      videos: [],
    });

    const wrapper = renderWithClients(
      <OpenstaxBookSection section={section} />,
    );

    expect(
      wrapper.getByText(
        "We don't have any videos for this section yet. We're working on it!",
      ),
    ).toBeVisible();
  });
});
