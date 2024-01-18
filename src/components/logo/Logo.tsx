import { useGetUserQuery } from 'src/hooks/api/userQuery';
import LibraryLogoSVG from 'src/resources/icons/library-logo.svg';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import s from './style.module.less';

const Logo = (): ReactElement => {
  const { data: user } = useGetUserQuery();

  const logoTitle = user?.organisation?.logoUrl
    ? `${user.organisation.name} logo - Go to homepage`
    : 'Library logo - Go to homepage';

  return (
    <Link to="/" reloadDocument aria-label={logoTitle} className={s.logo}>
      {user?.organisation?.logoUrl ? (
        <img alt={logoTitle} src={user?.organisation?.logoUrl} />
      ) : (
        <LibraryLogoSVG />
      )}
    </Link>
  );
};

export default Logo;
