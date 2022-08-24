import { OpenstaxChapter } from 'src/types/OpenstaxBook';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { renderWithClients } from 'src/testSupport/render';
import React from 'react';
import { Chapter } from 'src/components/openstax/book/Chapter';
import { OpenstaxChapterFactory } from 'src/testSupport/OpenstaxChapterFactory';

describe('OpenstaxBookChapter', () => {
  it('renders Chapter Overview when chapter has videos mapped as the first section', () => {
    const chapter: OpenstaxChapter = OpenstaxChapterFactory.sample({
      videos: [VideoFactory.sample({})],
      videoIds: ['1'],
    });

    const wrapper = renderWithClients(<Chapter chapter={chapter} />);

    const sections = wrapper.getAllByRole('heading', { level: 3 });
    expect(sections[0]).toBeVisible();
    expect(sections[0]).toHaveTextContent('Chapter overview');
  });

  it('will not show Chapter overview if there are no videos mapped to only the chapter', () => {
    const chapter: OpenstaxChapter = OpenstaxChapterFactory.sample({
      videos: undefined,
      videoIds: [],
    });

    const wrapper = renderWithClients(<Chapter chapter={chapter} />);

    expect(wrapper.queryByText('Chapter overview')).toBeNull();
  });
});
