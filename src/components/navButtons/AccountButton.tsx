import MyAccountSVG from 'src/resources/icons/my-account-icon.svg';
import ExternalLinkIcon from 'src/resources/icons/external-link-icon.svg';
import React, { useRef, useState } from 'react';
import c from 'classnames';
import { useBoclipsSecurity } from 'src/components/common/providers/BoclipsSecurityProvider';
import { Constants } from 'src/AppConstants';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { FeatureGate } from 'src/components/common/FeatureGate';
import CloseOnClickOutside from 'src/hooks/closeOnClickOutside';
import { Typography } from '@boclips-ui/typography';
import Button from '@boclips-ui/button';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { WithValidRoles } from 'src/components/common/errors/WithValidRoles';
import NotFound from 'src/views/notFound/NotFound';
import { ROLES } from 'src/types/Roles';
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

  const ordersOpenedEvent = () => {
    AnalyticsFactory.appcues().sendEvent(AppcuesEvent.YOUR_ORDERS_OPENED);
  };
  const myTeamOpened = () => {
    AnalyticsFactory.appcues().sendEvent(AppcuesEvent.MY_TEAM_OPENED);
  };

  const closeDialog = () => {
    setDisplayModal(false);
  };

  const handleDialogBlur: React.FocusEventHandler = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      closeDialog();
    }
  };

  const boclipsSecurity = useBoclipsSecurity();

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
              : 'My Account'
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
          <span className={s.userDetails}>
            <div className="font-medium">
              {user.firstName} {user.lastName}
            </div>
            <Typography.Body as="div" size="small" className="text-gray-800">
              {user.email}
            </Typography.Body>
          </span>
          <div role="menu" className={s.menu} aria-label="Account menu">
            <FeatureGate linkName="userOrders">
              <div className="pt-2">
                <Link onClick={ordersOpenedEvent} to="/orders" tabIndex={-1}>
                  <Typography.Body size="small" as="button">
                    My orders
                  </Typography.Body>
                </Link>
              </div>
            </FeatureGate>
            <WithValidRoles
              fallback={<NotFound />}
              roles={[ROLES.ROLE_BOCLIPS_WEB_APP_MANAGE_USERS]}
            >
              <div className="pt-2">
                <Link onClick={myTeamOpened} to="/team" tabIndex={-1}>
                  <Typography.Body size="small" as="button">
                    My team
                  </Typography.Body>
                </Link>
              </div>
            </WithValidRoles>
            <div className="pt-2">
              <Link to="/playlists" tabIndex={-1}>
                <Typography.Body size="small" as="button">
                  My playlists
                </Typography.Body>
              </Link>
            </div>
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
            <div className="pt-2">
              <Typography.Link>
                <Typography.Body
                  as="button"
                  size="small"
                  // Props aren't smart enough to know type does exist on button
                  // @ts-ignore
                  type="button"
                  onClick={() =>
                    boclipsSecurity.logout({
                      redirectUri: `${Constants.HOST}/`,
                    })
                  }
                >
                  Log out
                </Typography.Body>
              </Typography.Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
