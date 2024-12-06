import HomeSVG from '@resources/icons/home-icon.svg?react';
import React from 'react';
import c from 'classnames';
import s from '@components/navButtons/style.module.less';
import { useLocation, useNavigate } from 'react-router-dom';

export const HomeButton = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const isOnHomePage = location.pathname === '';
  const onClick = () => {
    navigate({
      pathname: '/',
    });
  };
  return (
    <div
      className={c(s.navButton, {
        [s.active]: isOnHomePage,
      })}
    >
      <button type="button" onClick={onClick} className={s.headerButton}>
        <HomeSVG />
        <span>Home</span>
        <span className="sr-only">Home</span>
      </button>
    </div>
  );
};
