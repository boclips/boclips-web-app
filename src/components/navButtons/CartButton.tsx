import React from 'react';
import { useCartQuery } from 'src/hooks/api/cartQuery';
import { useHistory, useLocation } from 'react-router-dom';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import c from 'classnames';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import s from './style.module.less';
import CartIcon from '../../resources/icons/cart-icon.svg';

const CartButton = () => {
  const { data: cart } = useCartQuery();
  const history = useHistory();

  const location = useLocation();
  const isOnCartPage = location.pathname.includes('cart');

  const cartOpenedEvent = () => {
    AnalyticsFactory.appcues().sendEvent(AppcuesEvent.CART_OPENED);
    history.push({
      pathname: '/cart',
    });
  };

  return (
    <div className={c(s.navButton, { [s.active]: isOnCartPage })}>
      <button type="button" onClick={cartOpenedEvent} data-qa="cart-button">
        <CartIcon />
        <span>
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
