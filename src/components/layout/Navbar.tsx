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
import LibraryButton from 'src/components/navButtons/LibraryButton';
import SkipLink from 'src/components/skipLink/SkipLink';
import { Typography } from '@boclips-ui/typography';
import ExternalLinkIcon from 'src/resources/icons/external-link-icon.svg';
import s from './navbar.module.less';
import { Search } from '../searchBar/SearchBar';
import { Link } from '../common/Link';

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
          'grid col-span-full grid-rows-navbar-responsive items-center gap-x-2 lg:gap-x-6 grid-cols-container',
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
            <button type="button" data-qa="side-menu" onClick={openSideMenu}>
              {showSideMenu ? <CrossIconSVG /> : <MenuIconSVG />}
            </button>
          </div>
        ) : (
          <div className={s.buttonsDesktop}>
            <LibraryButton />
            <AccountButton />
            <FeatureGate linkName="cart">
              <CartButton />
            </FeatureGate>
          </div>
        )}
      </nav>

      {showSideMenu && (
        <div className={s.slideMenu}>
          <div className={s.userInfo}>
            <span>
              {user.firstName} {user.lastName}
            </span>
            <span>{user.email}</span>
          </div>
          <div className={s.buttons}>
            <Link to="/library">Your library</Link>
            <Link to="/orders">Your orders</Link>
            <FeatureGate linkName="cart">
              <Link to="/cart">Cart</Link>
            </FeatureGate>
            <a
              target="_blank"
              href="https://www.boclips.com/boclips-platform-guide"
              className={s.platformGuide}
              rel="noreferrer"
            >
              <p>Platform guide</p>
              <span className="pl-1">
                <ExternalLinkIcon />
              </span>
            </a>

            <button type="button" onClick={logOut}>
              <Typography.Link>Log out</Typography.Link>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarResponsive;
