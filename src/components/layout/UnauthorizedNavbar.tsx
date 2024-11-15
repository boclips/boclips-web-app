import React, { ReactElement } from 'react';
import c from 'classnames';
import ClassroomLogoSVG from '@src/resources/icons/classroom-logo.svg';
import navbarStyle from './navbar.module.less';
import unauthorizedNavbarStyle from './unauthorizedNavbar.module.less';

const UnauthorizedNavbar = (): ReactElement => {
  return (
    <nav
      className={c(
        navbarStyle.navbarResponsive,
        'grid col-span-full grid-rows-navbar items-center gap-x-2 lg:gap-x-6 grid-cols-container',
      )}
      aria-label="Boclips navigation bar"
    >
      <div className={navbarStyle.logo}>
        <div className={unauthorizedNavbarStyle.logo}>
          <ClassroomLogoSVG data-qa="classroom-logo" />
        </div>
      </div>
    </nav>
  );
};

export default UnauthorizedNavbar;
