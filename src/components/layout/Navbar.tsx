import React, { ReactElement, useEffect, useState } from 'react';
import c from 'classnames';
import Logo from 'src/components/logo/Logo';
import MenuIconSVG from 'src/resources/icons/menu-icon.svg';
import CrossIconSVG from 'src/resources/icons/cross-icon.svg';
import { AccountButton } from 'src/components/navButtons/AccountButton';
import { FeatureGate } from 'src/components/common/FeatureGate';
import CartButton from 'src/components/navButtons/CartButton';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { Constants } from 'src/AppConstants';
import { useBoclipsSecurity } from 'src/components/common/providers/BoclipsSecurityProvider';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import PlaylistsButton from 'src/components/navButtons/PlaylistsButton';
import SkipLink from 'src/components/skipLink/SkipLink';
import SparksButton from 'src/components/navButtons/SparksButton';
import SideMenu from 'src/components/layout/SideMenu';
import s from './navbar.module.less';
import { Search } from '../searchBar/SearchBar';

const NavbarResponsive = (): ReactElement => {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const { data: user } = useGetUserQuery();
  const boclipsSecurity = useBoclipsSecurity();
  const breakpoints = useMediaBreakPoint();

  const mobileView =
    breakpoints.type === 'mobile' || breakpoints.type === 'tablet';

  const openSideMenu = () => {
    setShowSideMenu(!showSideMenu);
  };

  useEffect(() => {
    if (showSideMenu) {
      document.querySelector('body').style.overflow = 'hidden';
    } else {
      document.querySelector('body').style.overflow = null;
    }
  }, [showSideMenu]);

  const logOut = () => {
    boclipsSecurity.logout({
      redirectUri: `${Constants.HOST}/`,
    });
  };

  return (
    <>
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

        <SkipLink />

        <div className="row-start-2 row-end-2 col-start-2 col-end-26 pb-3 lg:pb-0 lg:pt-0 lg:row-start-1 lg:row-end-1 lg:col-start-8 lg:col-end-20">
          <Search showIconOnly />
        </div>

        {mobileView ? (
          <div className={s.buttons}>
            <button type="button" onClick={openSideMenu} aria-label="Menu">
              {showSideMenu ? <CrossIconSVG /> : <MenuIconSVG />}
            </button>
          </div>
        ) : (
          <div className={s.buttonsDesktop}>
            <FeatureGate feature="BO_WEB_APP_SPARKS">
              <SparksButton />
            </FeatureGate>
            <PlaylistsButton />
            <AccountButton />
            <FeatureGate linkName="cart">
              <CartButton />
            </FeatureGate>
          </div>
        )}
      </nav>

      {showSideMenu && <SideMenu user={user} logOut={logOut} />}
    </>
  );
};

export default NavbarResponsive;
