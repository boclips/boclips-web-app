import React from 'react';
import c from 'classnames';
import SkeletonTiles from '@src/components/skeleton/Skeleton';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import s from '../style.module.less';
import o from './themeSkeletonPage.module.less';

const ThemeSkeletonPage = () => {
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
    <>
      {screen.type === 'desktop' && (
        <div className={o.tocPanel}>
          <div className={c(s.skeleton, o.backButton)} />
          <div className={c(s.skeleton, o.navPanelTitle)} />
          <div className={c(s.skeleton, o.navPanelTopic)} />
          <div className={c(s.skeleton, o.navPanelVideoCount)} />
          <div className={c(s.skeleton, o.navPanelTarget)} />
          <div className={c(s.skeleton, o.navPanelTarget)} />
          <div className={c(s.skeleton, o.navPanelTarget)} />
          <div className={c(s.skeleton, o.navPanelTarget)} />
          <div className={c(s.skeleton, o.navPanelTarget)} />
          <div className={c(s.skeleton, o.navPanelTopic)} />
          <div className={c(s.skeleton, o.navPanelVideoCount)} />
          <div className={c(s.skeleton, o.navPanelTopic)} />
          <div className={c(s.skeleton, o.navPanelVideoCount)} />
        </div>
      )}
      <main className={o.main} data-qa="Loading details for theme">
        {screen.type !== 'desktop' && (
          <div className={c(s.skeleton, o.backButton)} />
        )}
        <div className={c(s.skeleton, o.title)} />
        <div className={c(s.skeleton, o.topic)} />
        <div className={c(s.skeleton, o.target)} />
        <SkeletonTiles cols={getColumnsToShow()} />
      </main>
    </>
  );
};

export default ThemeSkeletonPage;
