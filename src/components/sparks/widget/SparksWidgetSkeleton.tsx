import React from 'react';
import s from './sparksWidget.module.less';

export const SparksWidgetSkeleton = () => {
  return (
    <main
      className="col-start-2 col-end-26 row-start-2 row-end-2 lg:col-start-4 lg:col-end-24 md:pt-4"
      data-qa="Loading details for providers"
    >
      <div className={s.sparksCardWrapper}>
        <div className={s.skeleton} />
        <div className={s.skeleton} />
        <div className={s.skeleton} />
      </div>
    </main>
  );
};
