import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { ChapterSection } from 'src/components/openstax/book/ChapterSection';
import { OpenstaxChapter } from 'src/types/OpenstaxBook';
import s from './style.module.less';

interface Props {
  chapter: OpenstaxChapter;
}

export const Chapter = ({ chapter }: Props) => {
  const shouldShowChapterOverview = chapter.videoIds?.length > 0;

  return (
    <section id={`chapter-${chapter.number}`} className={s.anchor}>
      <Typography.H2 size="sm" className="text-gray-700">
        {chapter.displayLabel}
      </Typography.H2>
      {shouldShowChapterOverview && (
        <ChapterSection
          section={{ displayLabel: 'Chapter overview', videos: chapter.videos }}
        />
      )}
      {chapter.sections.map((section) => (
        <section
          id={`section-${chapter.number}-${section.number}`}
          className={s.anchor}
        >
          <ChapterSection section={section} />
        </section>
      ))}
    </section>
  );
};
