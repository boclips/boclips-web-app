import { Typography } from '@boclips-ui/typography';
import React from 'react';
import SparksLeftSVG from 'src/resources/sparks/sparks-left.svg';
import SparksRightSVG from 'src/resources/sparks/sparks-right.svg';
import c from 'classnames';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import s from './sparksHeader.module.less';

export const SparksHeader = () => {
  const breakpoints = useMediaBreakPoint();
  const desktopView = breakpoints.type === 'desktop';

  return (
    <div className={s.sparksHeader}>
      <Typography.H1
        className="text-center"
        size={{ mobile: 'md', tablet: 'lg', desktop: 'xl' }}
      >
        <span className={s.sparksTitle}>Spark</span> learning with our video
        picks
      </Typography.H1>
      <Typography.Body as="p" className={c('text-center', s.sparksDescription)}>
        Discover our video collections: Pedagogically-sequenced and
        expertly-curated for your course
      </Typography.Body>
      {desktopView && (
        <>
          <SparksLeftSVG className={s.sparksLeft} />
          <SparksRightSVG className={s.sparksRight} />
        </>
      )}
    </div>
  );
};
