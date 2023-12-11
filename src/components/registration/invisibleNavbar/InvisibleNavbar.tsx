import React from 'react';
import SkipLink from 'src/components/skipLink/SkipLink';
import CourseSparkLogoSVG from 'src/resources/icons/coursespark.svg';
import c from 'classnames';
import s from './style.module.less';

const InvisibleNavbar = () => {
  return (
    <nav
      className={c(
        'col-start-2 col-end-27 row-start-1 row-end-1',
        s.invisibleNavbar,
      )}
    >
      <CourseSparkLogoSVG className={s.logo} data-qa="logo" />
      <SkipLink />
    </nav>
  );
};

export default InvisibleNavbar;
