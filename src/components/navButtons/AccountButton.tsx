import MyAccountSVG from 'src/resources/icons/user-icon.svg';
import ExternalLinkIcon from 'src/resources/icons/external-link-icon.svg';
import React, { useRef, useState } from 'react';
import c from 'classnames';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { FeatureGate } from 'src/components/common/FeatureGate';
import CloseOnClickOutside from 'src/hooks/closeOnClickOutside';
import { Typography } from '@boclips-ui/typography';
import Button from '@boclips-ui/button';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import LogoutButton from 'src/components/layout/logoutButton/LogoutButton';
import getFormattedDate from 'src/services/getFormattedDate';
import { Link } from '../common/Link';
import s from './newstyle.module.less';

export const AccountButton = () => {
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const { data: user, isLoading } = useGetUserQuery();
  const ref = useRef(null);

  CloseOnClickOutside(ref, () => setDisplayModal(false));

  const onClick = () => {
    setDisplayModal(!displayModal);
  };

  const onMouseEnterAction = () => {
    setOnMouseEnter(true);
  };

  const onMouseLeaveAction = () => {
    setOnMouseEnter(false);
  };

  const contentOpenedEvent = () => {
    AnalyticsFactory.hotjar().event(HotjarEvents.MyContentOpened);
  };

  const ordersOpenedEvent = () => {
    AnalyticsFactory.hotjar().event(HotjarEvents.YourOrdersOpened);
  };

  const accountOpenedEvent = () => {
    AnalyticsFactory.hotjar().event(HotjarEvents.MyAccountOpened);
  };

  const myTeamOpened = () => {
    AnalyticsFactory.hotjar().event(HotjarEvents.MyTeamOpened);
  };

  const closeDialog = () => {
    setDisplayModal(false);
  };

  const handleDialogBlur: React.FocusEventHandler = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      closeDialog();
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDialog();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      data-qa="account-button"
      onMouseEnter={onMouseEnterAction}
      onMouseLeave={onMouseLeaveAction}
      className={c(s.accountMenu, { [s.active]: displayModal || onMouseEnter })}
    >
      {user && !isLoading && (
        <Button
          onClick={onClick}
          data-qa="account-menu"
          aria-expanded={displayModal}
          aria-haspopup
          className={s.accountButton}
          icon={<MyAccountSVG className={s.navbarIcon} />}
          text={
            user.firstName && user.firstName.trim().length > 0
              ? `${user.firstName}`
              : 'Account'
          }
          height="45px"
        />
      )}
      {displayModal && (
        <div
          data-qa="account-modal"
          ref={ref}
          className={s.tooltip}
          onBlur={handleDialogBlur}
        >
          <FeatureGate product={Product.CLASSROOM}>
            <div className="w-full">
              <Typography.Body
                size="small"
                as="div"
                weight="medium"
                aria-label={`Your unique access code is ${user.shareCode}`}
                className="bg-gray-100"
              >
                <div className="py-3 pl-4 text-gray-800 flex flex-col">
                  <span className="mb-1">Unique access code</span>
                  <span>{user.shareCode}</span>
                </div>
              </Typography.Body>
              {user.accessExpiresOn && (
                <Typography.Body
                  size="small"
                  as="div"
                  weight="medium"
                  className={s.expiryDate}
                  aria-label={`Free access until ${getFormattedDate(
                    user.accessExpiresOn,
                    {
                      monthFormat: 'long',
                    },
                  )}`}
                >
                  <div className="py-3 pl-4 text-gray-800 flex flex-col">
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
          </FeatureGate>
          <div role="menu" className={s.menu} aria-label="Account menu">
            <div className="pt-2">
              <Link onClick={accountOpenedEvent} to="/account" tabIndex={-1}>
                <Typography.Body size="small" as="button">
                  Account
                </Typography.Body>
              </Link>
            </div>
            <FeatureGate feature="BO_WEB_APP_DEV">
              <div className="pt-2">
                <Link onClick={contentOpenedEvent} to="/licenses" tabIndex={-1}>
                  <Typography.Body size="small" as="button">
                    Licenses
                  </Typography.Body>
                </Link>
              </div>
            </FeatureGate>
            <FeatureGate linkName="userOrders">
              <div className="pt-2">
                <Link onClick={ordersOpenedEvent} to="/orders" tabIndex={-1}>
                  <Typography.Body size="small" as="button">
                    Order History
                  </Typography.Body>
                </Link>
              </div>
            </FeatureGate>
            <FeatureGate linkName="updateUser">
              <div className="pt-2">
                <Link onClick={myTeamOpened} to="/team" tabIndex={-1}>
                  <Typography.Body size="small" as="button">
                    Team
                  </Typography.Body>
                </Link>
              </div>
            </FeatureGate>
            <div className="pt-2">
              <Link to="/playlists" tabIndex={-1}>
                <Typography.Body size="small" as="button">
                  Playlists
                </Typography.Body>
              </Link>
            </div>
            <FeatureGate product={Product.B2B}>
              <div className="pt-2">
                <a
                  target="_blank"
                  href="https://www.boclips.com/boclips-platform-guide"
                  rel="noreferrer"
                  tabIndex={-1}
                >
                  <Typography.Body
                    size="small"
                    as="button"
                    className={s.menuItem}
                  >
                    <span>Platform guide</span>
                    <span className={s.platformGuideIcon}>
                      <ExternalLinkIcon />
                    </span>
                  </Typography.Body>
                </a>
              </div>
            </FeatureGate>
            <div className="pt-2">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
