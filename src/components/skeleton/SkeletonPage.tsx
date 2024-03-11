import React from 'react';
import c from 'classnames';
import SkeletonTiles from './Skeleton';
import s from './style.module.less';

interface Props {
  title?: string;
}
const SkeletonPage = ({ title = 'skeleton' }: Props) => {
  return (
    <>
      <div
        title={title}
        className={c(
          s.skeleton,
          s.header,
          'grid-row-start-2 grid-row-end-2 col-start-2 col-end-26',
        )}
      />
      <div
        className={c(
          s.skeleton,
          s.description,
          'grid-row-start-3 grid-row-end-3 col-start-2 col-end-26',
        )}
      />
      <div
        className={c(
          s.skeleton,
          s.tab,
          'grid-row-start-4 grid-row-end-4 col-start-2 col-end-26',
        )}
      />
      <div className="grid-row-start-5 grid-row-end-5 col-start-2 col-end-26">
        <SkeletonTiles />
      </div>
    </>
  );
};

export default SkeletonPage;
