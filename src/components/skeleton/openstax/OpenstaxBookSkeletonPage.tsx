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
    <div data-qa="Loading details for book">
      {screen.type === 'desktop' && (
        <div className={o.tocPanel}>
          <div className={c(s.skeleton, o.backButton)} />
          <div className={c(s.skeleton, o.navPanelTitle)} />
          <div className={c(s.skeleton, o.navPanelChapter)} />
          <div className={c(s.skeleton, o.navPanelVideoCount)} />
          <div className={c(s.skeleton, o.navPanelSection)} />
          <div className={c(s.skeleton, o.navPanelSection)} />
          <div className={c(s.skeleton, o.navPanelSection)} />
          <div className={c(s.skeleton, o.navPanelSection)} />
          <div className={c(s.skeleton, o.navPanelSection)} />
          <div className={c(s.skeleton, o.navPanelChapter)} />
          <div className={c(s.skeleton, o.navPanelVideoCount)} />
          <div className={c(s.skeleton, o.navPanelChapter)} />
          <div className={c(s.skeleton, o.navPanelVideoCount)} />
        </div>
      )}
      <main className={o.main}>
        {screen.type !== 'desktop' && (
          <div className={c(s.skeleton, o.backButton)} />
        )}
        <div className={c(s.skeleton, o.title)} />
        <div className={c(s.skeleton, o.chapter)} />
        <div className={c(s.skeleton, o.section)} />
        <SkeletonTiles cols={getColumnsToShow()} />
      </main>
    </div>
  );
};

export default OpenstaxBookSkeletonPage;
