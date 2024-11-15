import s from '@src/components/layout/navbar.module.less';
import React from 'react';
import c from 'classnames';
import Logo from '@src/components/logo/Logo';

export const EmptyNavbar = () => {
  return (
    <nav
      className={c(
        s.navbarResponsive,
        'grid col-span-full grid-rows-navbar items-center gap-x-2 lg:gap-x-6 grid-cols-container',
      )}
      aria-label="Boclips navigation bar"
    >
      <div className={s.logo}>
        <Logo />
      </div>
    </nav>
  );
};
