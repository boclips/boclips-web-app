import s from 'src/components/layout/navbar.module.less';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { Link } from 'src/components/common/Link';
import ExternalLinkIcon from 'src/resources/icons/external-link-icon.svg';
import React from 'react';
import c from 'classnames';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import LogoutButton from 'src/components/layout/logoutButton/LogoutButton';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { Typography } from '@boclips-ui/typography';
import getFormattedDate from 'src/services/getFormattedDate';

interface Props {
  hasSearchInNavbar?: boolean;
}

const SideMenu = ({ hasSearchInNavbar = true }: Props) => {
  const { data: user, isLoading } = useGetUserQuery();

  return (
    <div className={c(s.slideMenu, { [s.oneLineNavbar]: !hasSearchInNavbar })}>
      <div className={s.buttons}>
        <FeatureGate product={Product.CLASSROOM}>
          {user && !isLoading && (
            <div className="pl-4 flex flex-col">
              <Typography.Body
                as="div"
                aria-label={`Your unique access code code is ${user.shareCode}`}
                className={s.shareCode}
              >
                <div className="flex flex-col">
                  <span className="mb-1">Unique access code</span>
                  <span>{user.shareCode}</span>
                </div>
              </Typography.Body>
              {user.accessExpiresOn && (
                <Typography.Body
                  as="div"
                  className={s.expiryDate}
                  aria-label={`Free access until ${getFormattedDate(
                    user.accessExpiresOn,
                    {
                      monthFormat: 'long',
                    },
                  )}`}
                >
                  <div className="flex flex-col">
                    <span className="mb-1">Free access until</span>
                    <span>
                      {getFormattedDate(user.accessExpiresOn, {
                        monthFormat: 'long',
                      })}
                    </span>
                  </div>
                </Typography.Body>
              )}
            </div>
          )}
        </FeatureGate>
        <Link to="/">Home</Link>
        <Link to="/videos">All videos</Link>
        <Link to="/account">Account</Link>
        <Link to="/alignments">Alignments</Link>
        <Link to="/playlists">Playlists</Link>
        <Link to="/content">My content</Link>
        <FeatureGate linkName="userOrders">
          <Link to="/orders">Order History</Link>
        </FeatureGate>
        <FeatureGate linkName="updateUser">
          <Link to="/team">My team</Link>
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
