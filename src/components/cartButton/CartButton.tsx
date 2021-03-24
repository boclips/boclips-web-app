import React, { useState } from 'react';
import { useCartQuery } from 'src/hooks/api/cartQuery';
import { Link, useLocation } from 'react-router-dom';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import c from 'classnames';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import s from './style.module.less';
import CartIcon from '../../resources/icons/cart-icon.svg';

const CartButton = () => {
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { data: cart } = useCartQuery();

  const location = useLocation();
  const isOnCartPage = location.pathname.includes('cart');
  const onMouseEnterAction = () => {
    setOnMouseEnter(true);
  };
  const onMouseLeaveAction = () => {
    setOnMouseEnter(false);
  };

  const cartOpenedEvent = () => {
    AnalyticsFactory.getAppcues().sendEvent(AppcuesEvent.CART_OPENED);
  };

  return (
    <div
      onMouseEnter={onMouseEnterAction}
      onMouseLeave={onMouseLeaveAction}
      className={c(s.cartButton, { [s.active]: isOnCartPage || onMouseEnter })}
    >
      <Link onClick={cartOpenedEvent} to="/cart" data-qa="cart-button">
        <CartIcon />
        <span className="text-xs mt-1 font-medium">
          Cart
          {cart?.items?.length > 0 && (
            <div data-qa="cart-counter" className={s.basketCounter}>
              {cart.items.length}
            </div>
          )}
        </span>
      </Link>
    </div>
  );
};

export default CartButton;
