import { Typography } from '@boclips-ui/typography';
import React, { useEffect } from 'react';
import SparksLeftSVG from 'src/resources/sparks/sparks-left.svg';
import c from 'classnames';
import s from './sparksHeader.module.less';

export const SparksHeader = () => {
  let index = 0;

  const animate = (star) => {
    const rand = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    star.style.setProperty('--star-left', `${rand(-40, 110)}%`);
    star.style.setProperty('--star-top', `${rand(100, -30)}%`);

    star.style.animation = 'none';
    star.offsetHeight;
    star.style.animation = '';
  };

  useEffect(() => {
    const interval = 3000;

    for (const star of document.getElementsByClassName(s.star)) {
      // animate(star);

      setTimeout(() => {
        setInterval(() => animate(star), 3000);
      }, index++ * (interval / 2));
    }
  }, [index]);

  return (
    <div className={s.sparksHeader}>
      <Typography.H1
        className=""
        size={{ mobile: 'md', tablet: 'lg', desktop: 'xl' }}
      >
        <span className={s.starWrapper}>
          <span className={s.star}>
            <SparksLeftSVG />
          </span>
          <span className={s.star}>
            <SparksLeftSVG />
          </span>
          <span className={s.star}>
            <SparksLeftSVG />
          </span>
          <span className={s.star}>
            <SparksLeftSVG />
          </span>
          <span className={s.title}>Sparks</span>
        </span>{' '}
        learning with our hand-picked video selections
      </Typography.H1>
      <Typography.Body as="p" className={c('text-center', s.sparksDescription)}>
        Discover video collections that are skillfully curated and educationally
        structured to enrich your course content
      </Typography.Body>
    </div>
  );
};
