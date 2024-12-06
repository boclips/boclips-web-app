import s from '@src/components/layout/navbar.module.less';
import { FeatureGate } from '@src/components/common/FeatureGate';
import { Link } from '@src/components/common/Link';
import ExternalLinkIcon from '@resources/icons/external-link-icon.svg?react';
import React from 'react';
import c from 'classnames';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import LogoutButton from '@src/components/layout/logoutButton/LogoutButton';

interface Props {
  hasSearchInNavbar?: boolean;
}

const SideMenu = ({ hasSearchInNavbar = true }: Props) => {
  return (
    <div className={c(s.slideMenu, { [s.oneLineNavbar]: !hasSearchInNavbar })}>
      <div className={s.buttons}>
        <Link to="/">Home</Link>
        <Link to="/videos">All videos</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/alignments">Alignments</Link>
        <Link to="/playlists">Playlists</Link>
        <Link to="/licenses">Licenses</Link>
        <FeatureGate linkName="userOrders">
          <Link to="/orders">Order History</Link>
        </FeatureGate>
        <FeatureGate linkName="updateUser">
          <Link to="/team">Team</Link>
        </FeatureGate>
        <FeatureGate linkName="cart">
          <Link to="/cart">Cart</Link>
        </FeatureGate>
        <FeatureGate product={Product.LIBRARY}>
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
        </FeatureGate>
        <LogoutButton />
      </div>
    </div>
  );
};

export default SideMenu;
