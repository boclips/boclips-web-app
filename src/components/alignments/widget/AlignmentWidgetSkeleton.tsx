import React from 'react';
import s from './alignmentWidget.module.less';

export const AlignmentWidgetSkeleton = () => {
  return (
    <main
      className="col-start-2 col-end-26 row-start-2 row-end-2 lg:col-start-4 lg:col-end-24 md:pt-4"
      data-qa="Loading details for providers"
    >
      <div className={s.alignmentCardWrapper}>
        <div className={s.skeleton} />
        <div className={s.skeleton} />
        <div className={s.skeleton} />
      </div>
    </main>
  );
};
