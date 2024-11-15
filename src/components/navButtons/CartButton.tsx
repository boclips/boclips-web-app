import React from 'react';
import { useCartQuery } from '@src/hooks/api/cartQuery';
import { useNavigate, useLocation } from 'react-router-dom';
import { HotjarEvents } from '@src/services/analytics/hotjar/Events';
import c from 'classnames';
import AnalyticsFactory from '@src/services/analytics/AnalyticsFactory';
import s from './style.module.less';
import CartIcon from '../../resources/icons/cart-icon.svg';

const CartButton = () => {
  const { data: cart } = useCartQuery();
  const navigate = useNavigate();

  const location = useLocation();
  const isOnCartPage = location.pathname.includes('cart');

  const cartOpenedEvent = () => {
    AnalyticsFactory.hotjar().event(HotjarEvents.CartOpened);
    navigate({
      pathname: '/cart',
    });
  };

  return (
    <div className={c(s.navButton, { [s.active]: isOnCartPage })}>
      <button
        type="button"
        onClick={cartOpenedEvent}
        data-qa="cart-button"
        className={s.headerButton}
      >
        <CartIcon className={s.navbarIcon} />
        <span role="status">
          Cart
          {cart?.items?.length > 0 && (
            <div data-qa="cart-counter" className={s.basketCounter}>
              {cart.items.length} <span className="sr-only">items in cart</span>
            </div>
          )}
        </span>
      </button>
    </div>
  );
};

export default CartButton;
