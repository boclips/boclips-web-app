import s from 'src/components/layout/navbar.module.less';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { Link } from 'src/components/common/Link';
import ExternalLinkIcon from 'src/resources/icons/external-link-icon.svg';
import { Typography } from '@boclips-ui/typography';
import React from 'react';
import c from 'classnames';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

interface Props {
  logOut: () => void;
  hasSearchInNavbar?: boolean;
}

const SideMenu = ({ logOut, hasSearchInNavbar = true }: Props) => {
  return (
    <div className={c(s.slideMenu, { [s.oneLineNavbar]: !hasSearchInNavbar })}>
      <div className={s.buttons}>
        <Link to="/alignments">Alignments</Link>
        <Link to="/playlists">Playlists</Link>
        <FeatureGate feature="BO_WEB_APP_DEV">
          <Link to="/content">My content</Link>
        </FeatureGate>
        <Link to="/orders">Your orders</Link>
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
        <button type="button" onClick={logOut}>
          <Typography.Link>Log out</Typography.Link>
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
