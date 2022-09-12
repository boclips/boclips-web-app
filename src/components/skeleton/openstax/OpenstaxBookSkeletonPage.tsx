import React from 'react';
import c from 'classnames';
import SkeletonTiles from 'src/components/skeleton/Skeleton';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import s from '../style.module.less';
import o from './openstaxBookSkeletonPage.module.less';

const OpenstaxBookSkeletonPage = () => {
  const screen = useMediaBreakPoint();

  const getColumnsToShow = () => {
    switch (screen.type) {
      case 'desktop':
        return 3;
      case 'tablet':
        return 2;
      case 'mobile':
        return 1;
      default:
        return 3;
    }
  };
  return (
    <div
      className="grid-row-start-2 grid-row-end-2 col-start-2 col-end-26"
      aria-label="Loading details for book"
    >
      <div className={c(s.skeleton, o.title)} />
      <div className={c(s.skeleton, o.chapter)} />
      <div className={c(s.skeleton, o.section)} />
      <SkeletonTiles rows={2} cols={getColumnsToShow()} />
    </div>
  );
};

export default OpenstaxBookSkeletonPage;
