import React, { ReactElement, useEffect, useState } from 'react';
import c from 'classnames';
import MenuIconSVG from 'src/resources/icons/menu-icon.svg';
import CrossIconSVG from 'src/resources/icons/cross-icon.svg';
import { FeatureGate } from 'src/components/common/FeatureGate';
import CartButton from 'src/components/navButtons/CartButton';
import { useGetAccount, useGetUserQuery } from 'src/hooks/api/userQuery';
import { Constants } from 'src/AppConstants';
import { useBoclipsSecurity } from 'src/components/common/providers/BoclipsSecurityProvider';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import PlaylistsButton from 'src/components/navButtons/PlaylistsButton';
import SkipLink from 'src/components/skipLink/SkipLink';
import AlignmentsButton from 'src/components/navButtons/AlignmentsButton';
import SideMenu from 'src/components/layout/SideMenu';
import LibraryButton from 'src/components/navButtons/LibraryButton';
import { HomeButton } from 'src/components/navButtons/HomeButton';
import { AccountButton } from 'src/components/navButtons/AccountButton';
import Logo from 'src/components/logo/Logo';
import { AccountStatus } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
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
  const boclipsSecurity = useBoclipsSecurity();
  const breakpoints = useMediaBreakPoint();
  const { data: account } = useGetAccount(user?.account.id);
  const isTrial = account?.status === AccountStatus.TRIAL;
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
          'grid col-span-full grid-rows-navbar items-center gap-x-2 lg:gap-x-6 grid-cols-container, ',
        )}
        aria-label="Boclips navigation bar"
      >
        <div className={s.logo}>
          <Logo />
        </div>

        <SkipLink />
        {showSearch && (
          <div className="row-start-1 row-end-1 col-start-2 col-end-26 pb-3 lg:pb-0 lg:pt-0 lg:row-start-1 lg:row-end-1 lg:col-start-7 lg:col-end-15">
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
            <div className="row-start-1 row-end-1 flex flex-col grid col-span-full ">
              <div className=" flex h-full justify-end col-start-15 col-end-26 ">
                <div className="flex mr-6">
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
              {isTrial && (
                <div
                  data-qa="trial-banner"
                  className="col-start-1 col-end-27 flex h-16 bg-green-success justify-center pt-4 text-white shadow-inner z-0"
                >
                  Welcome to your free preview of Boclips&apos; library. For
                  more information click here or speak to sales
                </div>
              )}
            </div>
          ))}
      </nav>

      {showSideMenu && mobileView && (
        <SideMenu user={user} logOut={logOut} hasSearchInNavbar={false} />
      )}
    </>
  );
};

export default NavbarResponsive;
