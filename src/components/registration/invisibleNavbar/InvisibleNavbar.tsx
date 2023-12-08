import React from 'react';
import SkipLink from 'src/components/skipLink/SkipLink';
import CourseSparkLogoSVG from 'src/resources/icons/coursespark.svg';
import s from './style.module.less';

const InvisibleNavbar = () => {
  return (
    <nav className="col-start-2 col-end-27 row-start-1 row-end-1">
      <CourseSparkLogoSVG className={s.logo} data-qa="logo" />
      <SkipLink />
    </nav>
  );
};

export default InvisibleNavbar;
