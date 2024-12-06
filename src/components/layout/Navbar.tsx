import React, { ReactElement, useEffect, useState } from 'react';
import c from 'classnames';
import MenuIconSVG from '@resources/icons/menu-icon.svg?react';
import CrossIconSVG from '@resources/icons/cross-icon.svg?react';
import { FeatureGate } from '@components/common/FeatureGate';
import CartButton from '@components/navButtons/CartButton';
import { useGetUserQuery } from '@src/hooks/api/userQuery';
import { useMediaBreakPoint } from 'boclips-ui';
import PlaylistsButton from '@components/navButtons/PlaylistsButton';
import SkipLink from '@components/skipLink/SkipLink';
import AlignmentsButton from '@components/navButtons/AlignmentsButton';
import SideMenu from '@components/layout/SideMenu';
import LibraryButton from '@components/navButtons/LibraryButton';
import { HomeButton } from '@components/navButtons/HomeButton';
import { AccountButton } from '@components/navButtons/AccountButton';
import Logo from '@components/logo/Logo';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import s from './navbar.module.less';
import { Search } from '../searchBar/SearchBar';

interface Props {
  showSearch?: boolean;
  showOptions?: boolean;
}

const NavbarResponsive = ({
  showSearch = true,
  showOptions = true,
}: Props): ReactElement => {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const { data: user, isLoading: isUserLoading } = useGetUserQuery();
  const isLibraryTrial =
    user?.account?.type === AccountType.TRIAL &&
    user?.account?.products?.indexOf(Product.CLASSROOM) < 0;
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

      <SkipLink />
      {showSearch && (
        <div className="row-start-2 row-end-2 col-start-2 col-end-26 pb-3 lg:pb-0 lg:pt-0 lg:row-start-1 lg:row-end-1 lg:col-start-7 lg:col-end-15">
          <Search showIconOnly />
        </div>
      )}
      {showOptions &&
        (mobileView ? (
          <div className={s.buttons}>
            <button type="button" onClick={openSideMenu} aria-label="Menu">
              {showSideMenu ? <CrossIconSVG /> : <MenuIconSVG />}
            </button>
          </div>
        ) : (
          <div className="col-start-15 col-end-26 row-start-1 row-end-1 flex h-full justify-end">
            <div className={c('flex mr-6', s.buttonsDesktop)}>
              <HomeButton />
              <LibraryButton />
              <AlignmentsButton />
              <PlaylistsButton />
              <FeatureGate linkName="cart">
                <CartButton />
              </FeatureGate>
            </div>
            {!isUserLoading && <AccountButton />}
          </div>
        ))}
      {isLibraryTrial && (
        <div data-qa="trial-banner" className={s.trialBanner}>
          Welcome! You&apos;re currently exploring Boclips Library. Need more
          info? Click{' '}
          <a
            rel="noopener noreferrer"
            href="https://boclips.com/boclips-faq"
            target="_blank"
            className="underline"
          >
            here
          </a>{' '}
          or connect with our{' '}
          <a
            rel="noopener noreferrer"
            href="https://www.boclips.com/contact"
            target="_blank"
            className="underline"
          >
            sales team
          </a>
        </div>
      )}
      {showSideMenu && mobileView && <SideMenu hasSearchInNavbar={false} />}
    </nav>
  );
};

export default NavbarResponsive;
