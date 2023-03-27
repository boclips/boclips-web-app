import React from 'react';
import c from 'classnames';
import s from './style.module.less';

const ProviderPageHeaderSkeleton = () => {
  return (
    <div className="col-start-2 col-end-26 grid-row-start-2 grid-row-end-2 mt-2 flex flex-col md:flex-row">
      <div className="flex grow flex-col space-y-2 md:space-y-4 mb-4">
        <div className={c(s.skeleton, s.title)} />
        <div className={c(s.skeleton, s.description)} />
        <div className={c(s.skeleton, s.description)} />
      </div>
      <div className={c(s.skeleton, s.logo)} />
    </div>
  );
};

export default ProviderPageHeaderSkeleton;
