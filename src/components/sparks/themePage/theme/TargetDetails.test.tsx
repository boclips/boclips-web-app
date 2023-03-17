import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { TargetDetails } from 'src/components/sparks/themePage/theme/TargetDetails';
import React from 'react';
import { Video } from 'boclips-api-client/dist/types';
import { renderWithClients } from 'src/testSupport/render';

describe('Target Details', () => {
  it.each([
    [0, '(0 videos)'],
    [1, '(1 video)'],
    [3, '(3 videos)'],
  ])(
    'renders target title with %i video(s)',
    (numberOfVideos: number, expectedVideoNumberLabel: string) => {
      const videos: Video[] = [];
      for (let i = 0; i < numberOfVideos; i++) {
        videos.push(VideoFactory.sample({ id: `video-id-${i}` }));
      }

      const wrapper = renderWithClients(
        <TargetDetails
          data={{
            title: '2.1 Life at the coop ',
            videos,
            id: 'target-2.1',
          }}
        />,
      );

      const targetTitle = wrapper.getByRole('heading', { level: 3 });

      expect(targetTitle).toBeVisible();
      expect(targetTitle).toHaveTextContent('2.1 Life at the coop ');
      expect(targetTitle).toHaveTextContent(expectedVideoNumberLabel);
    },
  );

  it('renders video cards when they are mapped to the target', () => {
    const videoTitle = 'Ducklings playing with hay';

    const wrapper = renderWithClients(
      <TargetDetails
        data={{
          title: '2.1 Life at the coop ',
          videos: [
            VideoFactory.sample({
              title: videoTitle,
              createdBy: 'Aunt Mary',
            }),
          ],
          id: 'target-2.1',
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

  it('renders messaging when no videos are mapped to the target', () => {
    const wrapper = renderWithClients(
      <TargetDetails
        data={{
          title: '2.1 Life at the coop ',
          videos: [],
          id: 'target-2.1',
        }}
      />,
    );

    expect(
      wrapper.getByText(
        "We don't have any videos for this target yet. We're working on it!",
      ),
    ).toBeVisible();
  });
});
