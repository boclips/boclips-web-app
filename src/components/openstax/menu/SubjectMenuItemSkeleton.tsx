import React from 'react';
import c from 'classnames';
import s from './style.module.less';

const SubjectMenuItemSkeleton = () => {
  return (
    <>
      {Array.from(Array(6)).map((_, i: number) => (
        <li
          data-qa={`subjects-skeleton-${i + 1}`}
          className={c(s.subject, s.subjectSkeleton)}
        />
      ))}
    </>
  );
};

export default SubjectMenuItemSkeleton;
