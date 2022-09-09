import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { ChapterElement } from 'src/components/openstax/book/ChapterElement';
import { OpenstaxChapter } from 'src/types/OpenstaxBook';
import s from './style.module.less';

interface Props {
  chapter: OpenstaxChapter;
}

export const Chapter = ({ chapter }: Props) => {
  return (
    <section id={`chapter-${chapter.number}`} className={s.anchor}>
      <Typography.H2 size="sm" className="text-gray-700">
        {chapter.displayLabel}
      </Typography.H2>
      {chapter.chapterOverview && (
        <ChapterElement
          id={`chapter-${chapter.number}-overview`}
          displayLabel={chapter.chapterOverview.displayLabel}
          videos={chapter.chapterOverview.videos}
        />
      )}
      {chapter.discussionPrompt && (
        <ChapterElement
          id={`chapter-${chapter.number}-discussion-prompt`}
          displayLabel={chapter.discussionPrompt.displayLabel}
          videos={chapter.discussionPrompt.videos}
        />
      )}
      {chapter.sections.map((section) => (
        <ChapterElement
          key={`chapter-${chapter.number}-section-${section.number}`}
          id={`chapter-${chapter.number}-section-${section.number}`}
          displayLabel={section.displayLabel}
          videos={section.videos}
        />
      ))}
    </section>
  );
};
