import MyAccountSVG from 'src/resources/icons/my-account-icon.svg';
import React, { useRef, useState } from 'react';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { Link } from 'react-router-dom';
import { Loading } from 'src/components/common/Loading';
import c from 'classnames';
import { useBoclipsSecurity } from 'src/components/common/providers/BoclipsSecurityProvider';
import { Constants } from 'src/AppConstants';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { FeatureGate } from 'src/components/common/FeatureGate';
import CloseOnClickOutside from 'src/hooks/closeOnClickOutside';
import s from './style.module.less';

export const AccountButton = () => {
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const { data, isLoading } = useGetUserQuery();
  const ref = useRef(null);

  CloseOnClickOutside(ref, setDisplayModal);

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
    AnalyticsFactory.getAppcues().sendEvent(AppcuesEvent.YOUR_ORDERS_OPENED);
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
      >
        <MyAccountSVG />
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
          <div className="text-xs text-gray-800">{data.email}</div>
          <div role="menu" aria-label="Account menu">
            <FeatureGate linkName="userOrders">
              <div className="pt-4 text-sm">
                <Link onClick={ordersOpenedEvent} to="/orders">
                  Your orders
                </Link>
              </div>
            </FeatureGate>

            <div className="pt-1 text-sm">
              <button
                className="button-link"
                type="button"
                onClick={() =>
                  boclipsSecurity.logout({
                    redirectUri: `${Constants.HOST}/`,
                  })
                }
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
