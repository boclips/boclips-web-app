import MyAccountSVG from 'src/resources/icons/my-account-icon.svg';
import ExternalLinkIcon from 'src/resources/icons/external-link-icon.svg';
import React, { useRef, useState } from 'react';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { Loading } from 'src/components/common/Loading';
import c from 'classnames';
import { useBoclipsSecurity } from 'src/components/common/providers/BoclipsSecurityProvider';
import { Constants } from 'src/AppConstants';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { FeatureGate } from 'src/components/common/FeatureGate';
import CloseOnClickOutside from 'src/hooks/closeOnClickOutside';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';
import { Link } from '../common/Link';

export const AccountButton = () => {
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const { data, isLoading } = useGetUserQuery();
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
      className={c(s.navButton, { [s.active]: displayModal || onMouseEnter })}
    >
      <button
        type="button"
        onClick={onClick}
        data-qa="account-menu"
        aria-expanded={displayModal}
        aria-haspopup
        className={s.headerButton}
      >
        <MyAccountSVG className={s.navbarIcon} />
        <span>Account</span>
      </button>

      {isLoading && displayModal && (
        <div ref={ref} className={s.tooltip}>
          <Loading />
        </div>
      )}

      {displayModal && (
        <div ref={ref} className={s.tooltip} onBlur={handleDialogBlur}>
          <div className="font-medium">
            {data.firstName} {data.lastName}
          </div>
          <Typography.Body as="div" size="small" className="text-gray-800">
            {data.email}
          </Typography.Body>
          <div role="menu" aria-label="Account menu">
            <FeatureGate linkName="userOrders">
              <div className="pt-4">
                <Link onClick={ordersOpenedEvent} to="/orders" tabIndex={-1}>
                  <Typography.Body size="small" as="button">
                    Your orders
                  </Typography.Body>
                </Link>
              </div>
            </FeatureGate>

            <div className="pt-1">
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
                  <p>Platform guide</p>
                  <span className={s.platformGuideIcon}>
                    <ExternalLinkIcon />
                  </span>
                </Typography.Body>
              </a>
            </div>

            <div className="pt-1">
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
