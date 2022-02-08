import c from 'classnames';
import React from 'react';
import s from './style.module.less';

interface Props {
  className?: string;
  numberOfTiles?: number;
}

const SkeletonTiles = ({ className, numberOfTiles = 8 }: Props) => {
  const skeletonsToRender = Array.from(Array(numberOfTiles).keys());

  return (
    <>
      {skeletonsToRender.map((i) => (
        <div key={i} className={c(className, s.skeleton)} />
      ))}
    </>
  );
};

export default SkeletonTiles;
