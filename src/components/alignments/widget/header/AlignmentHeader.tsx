import { Typography } from '@boclips-ui/typography';
import React from 'react';
import SparksLeftSVG from 'src/resources/sparks/sparks-left.svg';
import SparksRightSVG from 'src/resources/sparks/sparks-right.svg';
import c from 'classnames';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import s from './alignmentHeader.module.less';

export const AlignmentHeader = () => {
  const breakpoints = useMediaBreakPoint();
  const desktopView = breakpoints.type === 'desktop';

  return (
    <div className={s.alignmentHeader}>
      <Typography.H1
        className="text-center"
        size={{ mobile: 'md', tablet: 'lg', desktop: 'xl' }}
      >
        <span className={s.alignmentTitle}>Spark</span> learning with our
        hand-picked video selections
      </Typography.H1>
      <Typography.Body
        as="p"
        className={c('text-center', s.alignmentDescription)}
      >
        Discover video collections that are skillfully curated and educationally
        structured to enrich your course content
      </Typography.Body>
      {desktopView && (
        <>
          <SparksLeftSVG className={s.alignmentLeft} />
          <SparksRightSVG className={s.alignmentRight} />
        </>
      )}
    </div>
  );
};
