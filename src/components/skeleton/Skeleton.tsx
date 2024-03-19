import c from 'classnames';
import React from 'react';
import s from './style.module.less';

interface Props {
  className?: string;
  rows?: number;
  cols?: number;
  animated?: boolean;
}

const SkeletonTiles = ({
  className,
  rows = 2,
  cols = 4,
  animated = true,
}: Props) => {
  const skeletonsToRender = Array.from(Array(rows * cols).keys());
  const getGridColsClass = () => `grid-cols-${cols}`;

  return (
    <div className={c(s.skeleton, s.body, getGridColsClass())}>
      {skeletonsToRender.map((i) => (
        <div
          key={i}
          className={c(
            className,
            s.skeleton,
            animated ? s.skeletonAnimated : '',
          )}
          role="progressbar"
          aria-label="Loading"
        />
      ))}
    </div>
  );
};

export default SkeletonTiles;
