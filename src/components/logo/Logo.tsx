import { useGetUserQuery } from 'src/hooks/api/userQuery';
import BoclipsLogoSVG from 'src/resources/icons/boclips.svg';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import s from './style.module.less';

const Logo = (): ReactElement => {
  const { data: user } = useGetUserQuery();

  const logoTitle = user?.organisation?.name
    ? `${user.organisation.name} logo`
    : 'Boclips logo';

  return (
    <Link to="/" title={logoTitle} className={s.logo}>
      {user?.organisation?.logoUrl ? (
        <img alt={logoTitle} src={user?.organisation?.logoUrl} />
      ) : (
        <BoclipsLogoSVG />
      )}
    </Link>
  );
};

export default Logo;
