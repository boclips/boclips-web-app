import { Typography } from '@boclips-ui/typography';
import React from 'react';
import c from 'classnames';
import s from './sparksHeader.module.less';

export const SparksHeader = () => {
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
    </div>
  );
};
