import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { OpenstaxChapterSection } from 'src/components/openstax/book/OpenstaxChapterSection';
import { OpenstaxChapter } from 'src/types/OpenstaxBook';

interface Props {
  chapter: OpenstaxChapter;
}

export const OpenstaxBookChapter = ({ chapter }: Props) => {
  const shouldShowChapterOverview = chapter.videoIds.length > 0;

  return (
    <>
      <Typography.H2 size="sm" className="text-gray-700 mb-4">
        {chapter.displayLabel}
      </Typography.H2>
      {shouldShowChapterOverview && (
        <OpenstaxChapterSection
          section={{ displayLabel: 'Chapter overview', videos: chapter.videos }}
        />
      )}
      {chapter.sections.map((section) => (
        <OpenstaxChapterSection section={section} />
      ))}
    </>
  );
};
