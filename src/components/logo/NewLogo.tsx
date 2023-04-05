import { useGetUserQuery } from 'src/hooks/api/userQuery';
import CourseSparkLogoSVG from 'src/resources/icons/coursespark-logo.svg';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import s from './newstyle.module.less';

const Logo = (): ReactElement => {
  const { data: user } = useGetUserQuery();

  const logoTitle = user?.organisation?.name
    ? `${user.organisation.name} logo - Go to homepage`
    : 'CourseSpark logo - Go to homepage';

  return (
    <Link to="/" reloadDocument aria-label={logoTitle} className={s.logo}>
      {user?.organisation?.logoUrl ? (
        <img alt={logoTitle} src={user?.organisation?.logoUrl} />
      ) : (
        <CourseSparkLogoSVG />
      )}
    </Link>
  );
};

export default Logo;
