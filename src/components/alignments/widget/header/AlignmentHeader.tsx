import { Typography, useMediaBreakPoint } from 'boclips-ui';
import React from 'react';
import SparksLeftSVG from '@resources/sparks/sparks-left.svg?react';
import SparksRightSVG from '@resources/sparks/sparks-right.svg?react';
import c from 'classnames';
import s from './alignmentHeader.module.less';

export const AlignmentHeader = () => {
  const breakpoints = useMediaBreakPoint();
  const desktopView = breakpoints.type === 'desktop';

  return (
    <div className={s.alignmentHeader}>
      <Typography.H1
        className="text-center"
        size={{ mobile: 'md', tablet: 'lg', desktop: 'xl' }}
        data-qa="alignments-header-title"
      >
        <>
          Inspire learning with our expertly{' '}
          <span className={s.alignmentTitle}>aligned</span> videos
        </>
      </Typography.H1>
      <Typography.Body
        as="p"
        className={c('text-center', s.alignmentDescription)}
      >
        {`Fulfill essential educational standards and curriculum objectives with
          our curated Alignments. Video selection is tailored to state standards
          and curriculum criteria, providing content that aligns with and
          underpins your educational requirements.`}
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
