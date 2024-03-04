import s from 'src/components/layout/navbar.module.less';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { Link } from 'src/components/common/Link';
import ExternalLinkIcon from 'src/resources/icons/external-link-icon.svg';
import React from 'react';
import c from 'classnames';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import LogoutButton from 'src/components/layout/logoutButton/LogoutButton';

interface Props {
  hasSearchInNavbar?: boolean;
}

const SideMenu = ({ hasSearchInNavbar = true }: Props) => {
  return (
    <div className={c(s.slideMenu, { [s.oneLineNavbar]: !hasSearchInNavbar })}>
      <div className={s.buttons}>
        <FeatureGate product={Product.CLASSROOM}>
          <Link to="/">Home</Link>
          <Link to="/videos">All videos</Link>
        </FeatureGate>
        <Link to="/account">My account</Link>
        <Link to="/alignments">Alignments</Link>
        <Link to="/playlists">Playlists</Link>
        <FeatureGate feature="BO_WEB_APP_DEV">
          <Link to="/content">My content</Link>
        </FeatureGate>
        <FeatureGate linkName="userOrders">
          <Link to="/orders">Your orders</Link>
        </FeatureGate>
        <FeatureGate linkName="cart">
          <Link to="/cart">Cart</Link>
        </FeatureGate>
        <FeatureGate product={Product.B2B}>
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
